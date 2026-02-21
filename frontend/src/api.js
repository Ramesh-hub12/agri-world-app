import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000', // This connects to your FastAPI server
});

export default API;