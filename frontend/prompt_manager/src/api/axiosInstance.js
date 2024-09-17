import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7070',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 503) {
            // Handle database unavailable error
            alert('The service is currently unavailable. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;