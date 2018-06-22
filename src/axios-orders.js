import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-ad878.firebaseio.com/'
});

export default instance;