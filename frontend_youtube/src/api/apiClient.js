import axios from 'axios';


// Cấu hình axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Interceptor (nếu cần, thêm token vào header)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('USER_LOGIN');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const MAX_RETRIES = 10;
let retriesCount = 0;

apiClient.interceptors.response.use(
    (response) => {
        console.log(response);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
            console.log(error.response.status)
        if (error.response.status === 401) {
            if (retriesCount < MAX_RETRIES) {
                retriesCount++;

                const response = await extendToken();

                localStorage.setItem("USER_LOGIN", response);

                originalRequest.headers.Authorization = response;

                return apiClient(originalRequest);
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
)

const extendToken = async () => {
    try {
        const {data} = await apiClient.post('auth/extend', {}, {
            withCredentials: true
        });
        console.log(data);
        return data;
    } catch (error) {
        throw Error(error);
    }
}

export default apiClient;
