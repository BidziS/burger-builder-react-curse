export const createInputConfigObject = (elementType, elementConfig, value, validation, valid = false) => {
    return {
        elementType: elementType,
        elementConfig: elementConfig,
        value: value,
        validation: validation,
        valid: valid,
        touched: false
    };
}