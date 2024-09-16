import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
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