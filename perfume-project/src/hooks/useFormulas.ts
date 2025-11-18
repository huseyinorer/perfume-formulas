import { useState, useCallback } from 'react';
import { formulasApi } from '@/services';
import type { Formula, FormulaRequest, PendingRequest } from '@/types/api.types';

export const useFormulas = () => {
    const [formulas, setFormulas] = useState<Formula[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFormulas = useCallback(async (perfumeId: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await formulasApi.getByPerfumeId(perfumeId);
            setFormulas(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch formulas';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPendingRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await formulasApi.getPending();
            setPendingRequests(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch pending requests';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createFormula = useCallback(async (data: FormulaRequest) => {
        setLoading(true);
        setError(null);
        try {
            const formula = await formulasApi.create(data);
            return formula;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to create formula';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const requestFormula = useCallback(async (data: FormulaRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await formulasApi.request(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to submit formula request';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const approveRequest = useCallback(async (requestId: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await formulasApi.approve(requestId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to approve request';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const rejectRequest = useCallback(async (requestId: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await formulasApi.reject(requestId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to reject request';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteFormula = useCallback(async (formulaId: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await formulasApi.delete(formulaId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to delete formula';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        formulas,
        pendingRequests,
        loading,
        error,
        fetchFormulas,
        fetchPendingRequests,
        createFormula,
        requestFormula,
        approveRequest,
        rejectRequest,
        deleteFormula,
    };
};
