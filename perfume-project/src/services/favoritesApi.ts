import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Perfume } from '@/types/api.types';

export const favoritesApi = {
    toggle: async (perfume_id: number): Promise<{ message: string; is_favorite: boolean }> => {
        const response = await api.post(API_ENDPOINTS.TOGGLE_FAVORITE, { perfume_id });
        return response.data;
    },

    getAll: async (): Promise<Perfume[]> => {
        const response = await api.get<Perfume[]>(API_ENDPOINTS.FAVORITES);
        return response.data;
    },
};
