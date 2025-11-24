import { useState, useCallback, useEffect } from 'react';
import { PendingRequest } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL;

export const useAdmin = (isAdmin: boolean) => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  const fetchPendingRequests = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`${API_URL}/formulas/pending`);
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingRequests();
    }
  }, [isAdmin, fetchPendingRequests]);

  const handleApproveRequest = async (requestId: number, onSuccess?: () => void) => {
    try {
      const response = await fetch(`${API_URL}/formulas/approve/${requestId}`, {
        method: "POST",
      });
      if (response.ok) {
        if (onSuccess) onSuccess();
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const response = await fetch(`${API_URL}/formulas/reject/${requestId}`, {
        method: "POST",
      });
      if (response.ok) {
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return {
    pendingRequests,
    fetchPendingRequests,
    handleApproveRequest,
    handleRejectRequest
  };
};
