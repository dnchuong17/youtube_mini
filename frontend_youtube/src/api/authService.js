import apiClient from "./apiClient.js";


export const login = async (payload) => {
    try {
        const response = await apiClient.post('/auth/login', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};





export const register = async (payload) => {
    try {
        const response = await apiClient.post('auth/register', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (payload) => {
    try {
        const response = await apiClient.post('auth/forgot-password', payload);
        return response;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (payload) => {
    try {
        const response = await apiClient.post('auth/reset-password', payload);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const loginFacebook = async (payload) => {
    try {
        const response = await apiClient.post('/auth/login-facebook', payload);
        console.log("Response", response)
        return response;
    } catch (error) {
        throw error;
    }
}