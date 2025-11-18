import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/api.types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<{ message: string; user: User }> => {
        const response = await api.post(API_ENDPOINTS.REGISTER, data);
        return response.data;
    },

    changePassword: async (userId: number, oldPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
            userId,
            oldPassword,
            newPassword,
        });
        return response.data;
    },
};
