import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Perfume, PaginatedResponse } from '@/types/api.types';

interface PerfumeQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export const perfumesApi = {
    getAll: async (params: PerfumeQueryParams = {}): Promise<PaginatedResponse<Perfume>> => {
        const response = await api.get<PaginatedResponse<Perfume>>(API_ENDPOINTS.PERFUMES, { params });
        return response.data;
    },

    getById: async (id: number | string): Promise<Perfume> => {
        const response = await api.get<Perfume>(API_ENDPOINTS.PERFUME_BY_ID(id));
        return response.data;
    },

    getDetails: async (id: number | string): Promise<Perfume> => {
        const response = await api.get<Perfume>(API_ENDPOINTS.PERFUME_DETAILS(id));
        return response.data;
    },

    search: async (query: string): Promise<Perfume[]> => {
        const response = await api.get<Perfume[]>(API_ENDPOINTS.PERFUME_SEARCH, {
            params: { query },
        });
        return response.data;
    },

    create: async (data: Partial<Perfume>): Promise<Perfume> => {
        const response = await api.post<Perfume>(API_ENDPOINTS.PERFUMES, data);
        return response.data;
    },

    update: async (id: number | string, data: Partial<Perfume>): Promise<Perfume> => {
        const response = await api.put<Perfume>(API_ENDPOINTS.PERFUME_BY_ID(id), data);
        return response.data;
    },

    delete: async (id: number | string): Promise<{ message: string }> => {
        const response = await api.delete(API_ENDPOINTS.PERFUME_BY_ID(id));
        return response.data;
    },
};
