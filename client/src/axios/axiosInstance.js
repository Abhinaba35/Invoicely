import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 60000,
    withCredentials: true,
    headers: { "X-Custom-Header": "foobar" },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance };
