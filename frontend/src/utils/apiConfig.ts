import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/`
})

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('accessToken');
    config.headers.Authorization =  `Bearer ${accessToken}`;

    return config;
});

export default axiosInstance;