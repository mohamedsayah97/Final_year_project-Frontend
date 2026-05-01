import axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://localhost:3002',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true
    });


   