import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import classes from './ContactData.css';

import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        orderForm: {
            name: this.createInputConfigObject(
                'input', { type: 'text', placeholder: 'Your Name' }, '',
                { required: true }
            ),
            street: this.createInputConfigObject(
                'input', { type: 'text', placeholder: 'Street' }, '',
                { required: true }
            ),
            zipCode: this.createInputConfigObject(
                'input', { type: 'text', placeholder: 'ZIP Code' }, '',
                { required: true, minLength: 5, maxLength: 5 }
            ),
            country: this.createInputConfigObject(
                'input', { type: 'text', placeholder: 'Country' }, '',
                { required: true }
            ),
            email: this.createInputConfigObject(
                'input', { type: 'email', placeholder: 'Your E-Mail' }, '',
                { required: true }
            ),
            deliveryMethod: this.createInputConfigObject('select',
                {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                }, 'fastest', {}, true),
        },
        formIsValid: false,
        loading: false
    }

    createInputConfigObject(elementType, elementConfig, value, validation, valid = false) {
        return {
            elementType: elementType,
            elementConfig: elementConfig,
            value: value,
            validation: validation,
            valid: valid,
            touched: false
        };
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length >= rules.maxLength && isValid;
        }

        return isValid;
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
                console.log(response);
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error);
            });
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = { ...this.state.orderForm };
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched = true;

        let formIsValid = true;

        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        console.log(updatedFormElement);
        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={Object.keys(formElement.config.validation).length > 0 && formElement.config.validation.constructor === Object}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangeHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
};

export default connect(mapStateToProps)(ContactData);
