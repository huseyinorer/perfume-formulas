import { useState, useCallback, useEffect } from 'react';
import { perfumesApi } from '@/services';
import { PAGINATION } from '@/utils/constants';
import type { Perfume, PaginatedResponse } from '@/types/api.types';

interface UsePerfumesOptions {
    initialPage?: number;
    initialPageSize?: number;
    initialSortBy?: string;
    initialSortOrder?: 'asc' | 'desc';
    initialSearch?: string;
    autoFetch?: boolean;
}

export const usePerfumes = (options: UsePerfumesOptions = {}) => {
    const {
        initialPage = PAGINATION.DEFAULT_PAGE,
        initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
        initialSortBy = PAGINATION.DEFAULT_SORT_BY,
        initialSortOrder = PAGINATION.DEFAULT_SORT_ORDER as 'asc' | 'desc',
        initialSearch = '',
        autoFetch = true,
    } = options;

    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const fetchPerfumes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response: PaginatedResponse<Perfume> = await perfumesApi.getAll({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                search: searchTerm,
            });

            setPerfumes(response.data);
            setTotalPages(response.totalPages);
            setTotalItems(response.total);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch perfumes';
            setError(errorMessage);
            console.error('Error fetching perfumes:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortOrder, searchTerm]);

    const getPerfumeDetails = useCallback(async (id: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const perfume = await perfumesApi.getDetails(id);
            return perfume;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch perfume details';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSort = useCallback((field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    }, [sortBy, sortOrder]);

    useEffect(() => {
        if (autoFetch) {
            fetchPerfumes();
        }
    }, [fetchPerfumes, autoFetch]);

    return {
        perfumes,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        sortBy,
        sortOrder,
        searchTerm,
        setCurrentPage,
        setPageSize,
        setSearchTerm,
        handleSort,
        fetchPerfumes,
        getPerfumeDetails,
    };
};
