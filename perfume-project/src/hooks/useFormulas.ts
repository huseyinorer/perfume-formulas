import { useState, useCallback } from 'react';
import { Formula, FormulaRequest } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL;

export const useFormulas = (isLoggedIn: boolean, userId?: number) => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [creativeFormula, setCreativeFormula] = useState<any>(null); // Type this properly if possible

  const handleRatingChange = (formulaId: number, averageRating: number, reviewCount: number) => {
    const updatedFormulas = formulas.map((formula) => {
      if (formula.id === formulaId) {
        return {
          ...formula,
          averageRating: averageRating,
          reviewCount: reviewCount,
        };
      }
      return formula;
    });
    setFormulas(updatedFormulas);
  };

  const fetchFormulas = useCallback(async (perfume_id: number) => {
    try {
      const response = await fetch(`${API_URL}/perfumes/${perfume_id}/formulas`);
      const data = await response.json();
      setFormulas(data);
    } catch (error) {
      console.error("Error fetching formulas:", error);
    }
  }, []);

  const fetchCreativeFormula = useCallback(async (perfume_id: number) => {
    try {
      const response = await fetch(`${API_URL}/perfumes/${perfume_id}/details`);
      if (!response.ok) {
        throw new Error('Failed to fetch perfume details');
      }
      const data = await response.json();
      setCreativeFormula(data);
    } catch (error) {
      console.error("Error fetching creative formula:", error);
      setCreativeFormula(null);
    }
  }, []);

  const handleSaveFormula = async (formulaData: FormulaRequest, onSuccess?: () => void) => {
    try {
      const response = await fetch(`${API_URL}/formulas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formulaData),
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error saving formula:", error);
    }
  };

  const handleFormulaRequest = async (formulaData: FormulaRequest, onSuccess?: () => void) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/formulas/request`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formulaData,
          userId: userId || null,
        }),
      });

      if (response.ok) {
        alert(
          "Formül isteğiniz başarıyla gönderildi. Admin onayından sonra eklenecektir."
        );
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error saving formula request:", error);
    }
  };

  const handleDeleteFormula = async (formulaId: number, onSuccess?: () => void) => {
    if (window.confirm("Bu formülü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`${API_URL}/formulas/${formulaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          if (onSuccess) onSuccess();
        }
      } catch (error) {
        console.error("Error deleting formula:", error);
      }
    }
  };

  return {
    formulas,
    creativeFormula,
    fetchFormulas,
    fetchCreativeFormula,
    handleSaveFormula,
    handleFormulaRequest,
    handleDeleteFormula,
    setFormulas,
    handleRatingChange
  };
};
