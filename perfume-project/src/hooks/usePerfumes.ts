import { useState, useEffect, useCallback } from 'react';
import { Perfume, PaginatedResponse } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL;

export const usePerfumes = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPerfumes = useCallback(async () => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/perfumes?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ""
        }`,
        {
          method: "GET",
          headers,
          signal,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
           // Handle 401 if needed, but useAuth usually handles the logout state
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedResponse<Perfume> = await response.json();
      setPerfumes(data.data);
      setFilteredPerfumes(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching perfumes:", error);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [currentPage, pageSize, sortBy, sortOrder, debouncedSearchTerm]);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = useCallback((value: string) => {
      setSearchTerm(value);
  }, []);

  return {
    perfumes,
    filteredPerfumes,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    sortBy,
    sortOrder,
    handleSort,
    searchTerm,
    handleSearch,
    fetchPerfumes,
    loading
  };
};
