import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Formula, FormulaRequest, PendingRequest } from '@/types/api.types';

export const formulasApi = {
    getByPerfumeId: async (perfumeId: number | string): Promise<Formula[]> => {
        const response = await api.get<Formula[]>(API_ENDPOINTS.PERFUME_FORMULAS(perfumeId));
        return response.data;
    },

    create: async (data: FormulaRequest): Promise<Formula> => {
        const response = await api.post<Formula>(API_ENDPOINTS.FORMULAS, data);
        return response.data;
    },

    request: async (data: FormulaRequest): Promise<{ message: string; request: PendingRequest }> => {
        const response = await api.post(API_ENDPOINTS.FORMULA_REQUEST, data);
        return response.data;
    },

    getPending: async (): Promise<PendingRequest[]> => {
        const response = await api.get<PendingRequest[]>(API_ENDPOINTS.PENDING_FORMULAS);
        return response.data;
    },

    approve: async (id: number | string): Promise<{ message: string }> => {
        const response = await api.post(API_ENDPOINTS.APPROVE_FORMULA(id));
        return response.data;
    },

    reject: async (id: number | string): Promise<{ message: string }> => {
        const response = await api.post(API_ENDPOINTS.REJECT_FORMULA(id));
        return response.data;
    },

    delete: async (id: number | string): Promise<{ message: string }> => {
        const response = await api.delete(API_ENDPOINTS.DELETE_FORMULA(id));
        return response.data;
    },
};
