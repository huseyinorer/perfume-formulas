import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Autocomplete from "./Autocomplete";

const AddStockDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    perfume_id: "",
    price: "",
    stock_quantity: "",
    category: "",
  });
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handlePerfumeSelect = (perfume) => {
    setFormData((prev) => ({ ...prev, perfume_id: perfume.perfume_id || perfume.id }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.perfume_id) {
      setError("Lütfen bir parfüm seçin.");
      return;
    }
    if (!formData.price || !formData.stock_quantity) {
      setError("Fiyat ve stok zorunludur.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/perfume-stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          perfume_id: formData.perfume_id,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity),
          category: formData.category,
        }),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError("Stok eklenirken hata oluştu.");
      }
    } catch (err) {
      setError("Stok eklenirken hata oluştu.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stok Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Parfüm</Label>
            <Autocomplete onSelect={handlePerfumeSelect} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Fiyat</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2"
              placeholder="Fiyat"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stok Miktarı</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2"
              placeholder="Stok miktarı"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2"
              placeholder="Kategori"
            />
          </div>
          {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}
          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">Kaydet</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockDialog;

