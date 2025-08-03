import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            try {
                const parsedAuth = JSON.parse(auth);
                if (parsedAuth.accessToken) {
                    config.headers.Authorization = `Bearer ${parsedAuth.accessToken}`;
                }
            } catch (error) {
                console.error('Error parsing auth token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh the token
                const refreshResponse = await axios.get('/api/auth/refresh', {
                    withCredentials: true,
                    baseURL: 'http://localhost:5000'
                });
                
                if (refreshResponse.data.accessToken) {
                    // Update stored auth
                    const auth = localStorage.getItem('auth');
                    if (auth) {
                        const parsedAuth = JSON.parse(auth);
                        parsedAuth.accessToken = refreshResponse.data.accessToken;
                        localStorage.setItem('auth', JSON.stringify(parsedAuth));
                    }
                    
                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('auth');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;