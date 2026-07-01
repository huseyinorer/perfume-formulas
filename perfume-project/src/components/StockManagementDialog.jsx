import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Clock3,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import AddStockDialog from './AddStockDialog';
import Pagination from './Pagination';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const PROVIDERS = [
  { id: 'shopier', label: 'Shopier', enabled: true },
  { id: 'ikas', label: 'ikas', enabled: false },
];

const SHOPIER_CATEGORY = {
  FEMALE: { id: '9d99fc7eefb60892', label: 'Kadın' },
  MALE: { id: '6aee837bc71ba3f3', label: 'Erkek' },
  UNISEX: { id: '9806ee2567a27cf4', label: 'Unisex' },
};

const SHOPIER_CATEGORY_OPTIONS = Object.values(SHOPIER_CATEGORY);

const emptyMaturingForm = { quantity: '', maturation_start_date: '', notes: '' };
const emptyShopierProductForm = {
  title: '',
  description: '',
  price: '',
  stockQuantity: '',
  shippingPrice: '50.00',
  discount: false,
  categoryId: '',
  mediaUrl: '',
};
const emptyShopierUpdateForm = {
  title: '',
  price: '',
  stockQuantity: '',
};

const formatCurrency = (value) => `₺${value ?? 0}`;

const calculateShopierPrice = (cost) => {
  const numericCost = Number(cost) || 0;
  return Math.floor(((numericCost + Math.max(numericCost * 0.6, 100) + 100) / 0.94 / 10)) * 10;
};

const getShopierStatusDisplay = (status) => {
  if (status === 'inStock') {
    return {
      label: 'Stokta',
      className:
        'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300',
    };
  }

  if (status === 'outOfStock') {
    return {
      label: 'Stok Dışı',
      className:
        'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300',
    };
  }

  return {
    label: '-',
    className:
      'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };
};

const getTodayInputDate = () => new Date().toISOString().split('T')[0];

const StockManagementDialog = ({ open = false, onOpenChange, variant = 'dialog' }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const isPage = variant === 'page';
  const isActive = isPage || open;

  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [stockList, setStockList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [editingStock, setEditingStock] = useState(null);
  const [newStockQuantity, setNewStockQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailPerfume, setSelectedDetailPerfume] = useState(null);
  const [shopierDetail, setShopierDetail] = useState(null);
  const [loadingShopierDetail, setLoadingShopierDetail] = useState(false);
  const [updatingShopierProduct, setUpdatingShopierProduct] = useState(false);
  const [shopierDetailError, setShopierDetailError] = useState(null);
  const [shopierUpdateForm, setShopierUpdateForm] = useState(emptyShopierUpdateForm);

  const [isMaturationModalOpen, setIsMaturationModalOpen] = useState(false);
  const [selectedMaturationPerfume, setSelectedMaturationPerfume] = useState(null);
  const [maturationList, setMaturationList] = useState([]);
  const [showMaturationForm, setShowMaturationForm] = useState(false);
  const [maturingForm, setMaturingForm] = useState(emptyMaturingForm);

  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [selectedStorePerfume, setSelectedStorePerfume] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('shopier');
  const [storeProducts, setStoreProducts] = useState([]);
  const [currentLinks, setCurrentLinks] = useState(null);
  const [selectedStoreProductId, setSelectedStoreProductId] = useState('');
  const [loadingStoreProducts, setLoadingStoreProducts] = useState(false);
  const [savingStoreLink, setSavingStoreLink] = useState(false);
  const [clearingStoreLink, setClearingStoreLink] = useState(false);
  const [isCreateShopierModalOpen, setIsCreateShopierModalOpen] = useState(false);
  const [selectedCreateShopierPerfume, setSelectedCreateShopierPerfume] = useState(null);
  const [shopierProductForm, setShopierProductForm] = useState(emptyShopierProductForm);
  const [loadingShopierProductPreview, setLoadingShopierProductPreview] = useState(false);
  const [creatingShopierProduct, setCreatingShopierProduct] = useState(false);
  const [shopierProductError, setShopierProductError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 800);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!isActive) return;
    const abortController = new AbortController();
    fetchStockList(abortController.signal);
    return () => abortController.abort();
  }, [isActive, debouncedSearchTerm, currentPage, pageSize]);

  useEffect(() => {
    if (!isStoreModalOpen || !selectedStorePerfume) return;
    loadStoreProducts(selectedStorePerfume.id, selectedProvider);
  }, [isStoreModalOpen, selectedStorePerfume, selectedProvider]);

  useEffect(() => {
    if (!isDetailModalOpen || !selectedDetailPerfume) return;
    const abortController = new AbortController();
    loadShopierDetail(selectedDetailPerfume.id, abortController.signal);
    return () => abortController.abort();
  }, [isDetailModalOpen, selectedDetailPerfume]);

  const fetchStockList = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/perfume-stock?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          signal,
        }
      );
      if (!response.ok) throw new Error('Veri alınamadı');
      const data = await response.json();
      setStockList(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const loadMaturationList = async (perfume) => {
    const response = await fetch(
      `${API_URL}/perfume-stock/maturation/by-perfume/${perfume.perfume_id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    if (!response.ok) throw new Error('Demlenme kayıtları alınamadı');
    setMaturationList(await response.json());
  };

  const loadStoreProducts = async (stockId, provider) => {
    setLoadingStoreProducts(true);
    try {
      const query = new URLSearchParams({ provider });
      const response = await fetch(`${API_URL}/perfume-stock/${stockId}/store-links?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Mağaza ürünleri alınamadı');
      const data = await response.json();
      setCurrentLinks(data.current);
      setStoreProducts(data.products);
      const linkedId =
        provider === 'shopier' ? data.current.shopier.product_id : data.current.ikas.product_id;
      setSelectedStoreProductId(linkedId || '');
    } catch (err) {
      setStoreProducts([]);
      setCurrentLinks(null);
      setSelectedStoreProductId('');
      alert(err.message);
    } finally {
      setLoadingStoreProducts(false);
    }
  };

  const loadShopierDetail = async (stockId, signal) => {
    setLoadingShopierDetail(true);
    setShopierDetailError(null);
    setShopierDetail(null);
    setShopierUpdateForm(emptyShopierUpdateForm);

    try {
      const response = await fetch(`${API_URL}/perfume-stock/${stockId}/store-details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        signal,
      });
      if (!response.ok) throw new Error('Shopier detaylari alinamadi');
      const data = await response.json();
      setShopierDetail(data);
      setShopierUpdateForm({
        title: data.product?.name || data.current?.product_name || '',
        price:
          data.product?.price !== undefined && data.product?.price !== null
            ? String(data.product.price)
            : selectedDetailPerfume?.shopier_price !== undefined
              ? String(selectedDetailPerfume.shopier_price)
              : '',
        stockQuantity:
          data.product?.stock !== undefined && data.product?.stock !== null
            ? String(data.product.stock)
            : selectedDetailPerfume?.stock_quantity !== undefined
              ? String(selectedDetailPerfume.stock_quantity)
              : '',
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setShopierDetailError(err.message);
      }
    } finally {
      if (!signal?.aborted) setLoadingShopierDetail(false);
    }
  };

  const handleUpdateShopierProduct = async () => {
    if (!selectedDetailPerfume?.shopier_product_id) return;

    const title = shopierUpdateForm.title.trim();
    const rawPrice = String(shopierUpdateForm.price).trim();
    const rawStockQuantity = String(shopierUpdateForm.stockQuantity).trim();
    const formPrice = Number(shopierUpdateForm.price);
    const stockQuantity = Number(shopierUpdateForm.stockQuantity);
    const expectedShopierPrice = calculateShopierPrice(selectedDetailPerfume.price);
    const shopierPrice = Number(shopierDetail?.product?.price);
    const hasShopierPriceMismatch =
      Number.isFinite(shopierPrice) &&
      Number.isFinite(expectedShopierPrice) &&
      Math.abs(shopierPrice - expectedShopierPrice) >= 0.01;
    const price = hasShopierPriceMismatch ? expectedShopierPrice : formPrice;

    if (!title) return setShopierDetailError('Shopier urun adi bos olamaz');
    if (!rawPrice) return setShopierDetailError('Shopier fiyati bos olamaz');
    if (!rawStockQuantity) return setShopierDetailError('Shopier stok adedi bos olamaz');
    if (Number.isNaN(formPrice) || formPrice < 0) {
      return setShopierDetailError('Shopier fiyati pozitif bir sayi olmali');
    }
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      return setShopierDetailError('Shopier stok adedi pozitif bir tam sayi olmali');
    }

    setUpdatingShopierProduct(true);
    setShopierDetailError(null);

    try {
      const response = await fetch(
        `${API_URL}/perfume-stock/${selectedDetailPerfume.id}/shopier-product/sync`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            title,
            price,
            stockQuantity,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Shopier urunu guncellenemedi');

      setShopierDetail({
        provider: 'shopier',
        current: data.current,
        product: data.product,
      });
      setShopierUpdateForm({
        title: data.product?.name || data.current?.product_name || title,
        price:
          data.product?.price !== undefined && data.product?.price !== null
            ? String(data.product.price)
            : String(price),
        stockQuantity:
          data.product?.stock !== undefined && data.product?.stock !== null
            ? String(data.product.stock)
            : String(stockQuantity),
      });
    } catch (err) {
      setShopierDetailError(err.message);
    } finally {
      setUpdatingShopierProduct(false);
    }
  };

  const handleStockUpdate = async (id) => {
    const updates = {};
    if (newStockQuantity !== '') {
      const qty = parseInt(newStockQuantity, 10);
      if (qty < 0) return alert("Stok miktarı 0'dan küçük olamaz");
      updates.stock_quantity = qty;
    }
    if (newPrice !== '') {
      const prc = parseFloat(newPrice);
      if (prc < 0) return alert("Maliyet 0'dan küçük olamaz");
      updates.price = prc;
    }
    if (Object.keys(updates).length === 0) return alert('En az bir değer girilmelidir');

    try {
      const response = await fetch(`${API_URL}/perfume-stock/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Stok güncellenemedi');
      setStockList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                shopier_price:
                  updates.price !== undefined ? calculateShopierPrice(updates.price) : item.shopier_price,
              }
            : item
        )
      );
      setSelectedDetailPerfume((prev) =>
        prev?.id === id
          ? {
              ...prev,
              ...updates,
              shopier_price:
                updates.price !== undefined ? calculateShopierPrice(updates.price) : prev.shopier_price,
            }
          : prev
      );
      setEditingStock(null);
      setNewStockQuantity('');
      setNewPrice('');
      fetchStockList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenMaturationModal = async (perfume) => {
    setSelectedMaturationPerfume(perfume);
    setMaturingForm({ ...emptyMaturingForm, maturation_start_date: getTodayInputDate() });
    setShowMaturationForm(false);
    setIsMaturationModalOpen(true);
    try {
      await loadMaturationList(perfume);
    } catch (err) {
      setMaturationList([]);
      alert(err.message);
    }
  };

  const handleOpenDetailModal = (perfume) => {
    setSelectedDetailPerfume(perfume);
    setShopierDetail(null);
    setShopierDetailError(null);
    setIsDetailModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setNewStockQuantity('');
    setNewPrice('');
  };

  const handleSubmitMaturation = async (e) => {
    e.preventDefault();
    if (!selectedMaturationPerfume) return;
    try {
      const response = await fetch(`${API_URL}/perfume-stock/maturation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          perfume_id: selectedMaturationPerfume.perfume_id,
          quantity: Number(maturingForm.quantity),
          maturation_start_date: maturingForm.maturation_start_date,
          notes: maturingForm.notes,
        }),
      });
      if (!response.ok) throw new Error('Demlenen eklenemedi');
      await loadMaturationList(selectedMaturationPerfume);
      fetchStockList();
      setShowMaturationForm(false);
      setMaturingForm(emptyMaturingForm);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteMaturation = async (maturationId) => {
    try {
      const response = await fetch(`${API_URL}/perfume-stock/maturation/${maturationId}/complete`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Demlenen stoklara aktarılamadı');
      setMaturationList((prev) => prev.filter((item) => item.id !== maturationId));
      fetchStockList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveStoreLink = async (productIdOverride = null) => {
    if (!selectedStorePerfume || selectedProvider !== 'shopier') return;
    const targetProductId = productIdOverride ?? selectedStoreProductId;
    const selectedProduct = storeProducts.find((item) => item.id === targetProductId);
    if (!selectedProduct) return alert('Lütfen bir Shopier ürünü seçin');

    setSavingStoreLink(true);
    try {
      const response = await fetch(
        `${API_URL}/perfume-stock/${selectedStorePerfume.id}/store-links`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            provider: 'shopier',
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
          }),
        }
      );
      if (!response.ok) throw new Error('Mağaza ürünü eşleştirilemedi');
      setCurrentLinks((prev) => ({
        ...prev,
        shopier: { product_id: selectedProduct.id, product_name: selectedProduct.name },
      }));
      fetchStockList();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingStoreLink(false);
    }
  };

  const handleSelectStoreProduct = async (productId) => {
    setSelectedStoreProductId(productId);

    if (!productId) {
      return;
    }

    await handleSaveStoreLink(productId);
  };

  const handleClearStoreLink = async () => {
    if (!selectedStorePerfume || selectedProvider !== 'shopier') return;

    setClearingStoreLink(true);
    try {
      const query = new URLSearchParams({ provider: 'shopier' });
      const response = await fetch(
        `${API_URL}/perfume-stock/${selectedStorePerfume.id}/store-links?${query}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!response.ok) throw new Error('Shopier eslestirmesi silinemedi');
      setCurrentLinks((prev) => ({
        ...prev,
        shopier: { product_id: null, product_name: null },
      }));
      setSelectedStoreProductId('');
      fetchStockList();
    } catch (err) {
      alert(err.message);
    } finally {
      setClearingStoreLink(false);
    }
  };

  const handleOpenCreateShopierModal = async (perfume) => {
    setSelectedCreateShopierPerfume(perfume);
    setShopierProductForm(emptyShopierProductForm);
    setShopierProductError(null);
    setIsCreateShopierModalOpen(true);
    setLoadingShopierProductPreview(true);

    try {
      const response = await fetch(`${API_URL}/perfume-stock/${perfume.id}/shopier-product-preview`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Shopier urun bilgisi hazirlanamadi');

      setShopierProductForm({
        title: data.payload.title || '',
        description: data.payload.description || '',
        price: data.payload.priceData?.price || '',
        stockQuantity: data.payload.stockQuantity?.toString() || '',
        shippingPrice: data.payload.priceData?.shippingPrice || '50.00',
        discount: Boolean(data.payload.priceData?.discount),
        categoryId: data.payload.categories?.[0]?.categoryId || '',
        mediaUrl: data.payload.media?.[0]?.url || '',
      });

      if (!data.imageBaseUrlConfigured) {
        setShopierProductError('Gorsel base URL otomatik tespit edilemedi. Gorsel URL girilmeli.');
      }
    } catch (err) {
      setShopierProductError(err.message);
    } finally {
      setLoadingShopierProductPreview(false);
    }
  };

  const handleCreateShopierProduct = async (e) => {
    e.preventDefault();
    if (!selectedCreateShopierPerfume) return;

    setCreatingShopierProduct(true);
    setShopierProductError(null);

    try {
      const response = await fetch(
        `${API_URL}/perfume-stock/${selectedCreateShopierPerfume.id}/shopier-product`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            title: shopierProductForm.title,
            description: shopierProductForm.description,
            price: shopierProductForm.price,
            stockQuantity: Number(shopierProductForm.stockQuantity),
            shippingPrice: shopierProductForm.shippingPrice,
            discount: shopierProductForm.discount,
            categoryId: shopierProductForm.categoryId,
            mediaUrl: shopierProductForm.mediaUrl,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Shopier urunu olusturulamadi');

      setStockList((prev) =>
        prev.map((item) =>
          item.id === selectedCreateShopierPerfume.id
            ? {
                ...item,
                shopier_product_id: data.data.shopier_product_id,
                shopier_product_name: data.data.shopier_product_name,
              }
            : item
        )
      );
      setIsCreateShopierModalOpen(false);
      setSelectedCreateShopierPerfume(null);
      setShopierProductForm(emptyShopierProductForm);
      fetchStockList();
    } catch (err) {
      setShopierProductError(err.message);
    } finally {
      setCreatingShopierProduct(false);
    }
  };

  const sortedStockList = sortBy
    ? [...stockList].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        if (['category', 'name'].includes(sortBy)) {
          aValue = (aValue || '').toLocaleLowerCase();
          bValue = (bValue || '').toLocaleLowerCase();
          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      })
    : stockList;

  const detailNoteGroups = selectedDetailPerfume
    ? [
        { label: 'Üst Notalar', value: selectedDetailPerfume.top_notes },
        { label: 'Orta Notalar', value: selectedDetailPerfume.middle_notes },
        { label: 'Alt Notalar', value: selectedDetailPerfume.base_notes },
      ]
    : [];
  const shopierStatusDisplay = getShopierStatusDisplay(shopierDetail?.product?.status);
  const expectedShopierPrice = selectedDetailPerfume
    ? calculateShopierPrice(selectedDetailPerfume.price)
    : null;
  const actualShopierPrice = Number(shopierDetail?.product?.price);
  const hasShopierPriceMismatch =
    selectedDetailPerfume?.shopier_product_id &&
    shopierDetail?.product &&
    Number.isFinite(actualShopierPrice) &&
    Number.isFinite(expectedShopierPrice) &&
    Math.abs(actualShopierPrice - expectedShopierPrice) >= 0.01;

  const stockContent = (
    <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Parfüm ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex justify-between items-center gap-4">
              <h2 className="text-xl font-semibold dark:text-gray-100">Stok Yönetimi</h2>
              <Button
                onClick={() => setIsAddStockDialogOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Stok Ekle
              </Button>
            </div>

            <AddStockDialog
              open={isAddStockDialogOpen}
              onClose={() => setIsAddStockDialogOpen(false)}
              onSuccess={fetchStockList}
            />

            {loading ? (
              <div className="text-center py-8">Yükleniyor...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer"
                        onClick={() =>
                          setSortBy('name') ||
                          setSortDirection(
                            sortBy === 'name' && sortDirection === 'asc' ? 'desc' : 'asc'
                          )
                        }
                      >
                        <span className="flex items-center gap-1">
                          Parfüm Adı{' '}
                          {sortBy === 'name' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-blue-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-blue-500" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                          )}
                        </span>
                      </TableHead>
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer"
                        onClick={() =>
                          setSortBy('stock_quantity') ||
                          setSortDirection(
                            sortBy === 'stock_quantity' && sortDirection === 'asc' ? 'desc' : 'asc'
                          )
                        }
                      >
                        <span className="flex items-center gap-1">
                          Stok{' '}
                          {sortBy === 'stock_quantity' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-blue-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-blue-500" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                          )}
                        </span>
                      </TableHead>
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer"
                        onClick={() =>
                          setSortBy('price') ||
                          setSortDirection(
                            sortBy === 'price' && sortDirection === 'asc' ? 'desc' : 'asc'
                          )
                        }
                      >
                        <span className="flex items-center gap-1">
                          Maliyet{' '}
                          {sortBy === 'price' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-blue-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-blue-500" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                          )}
                        </span>
                      </TableHead>
                      <TableHead className="dark:text-gray-300">Kategori</TableHead>
                      <TableHead className="dark:text-gray-300">Demlenme Bilgisi</TableHead>
                      <TableHead className="dark:text-gray-300 text-center">Shopier</TableHead>
                      <TableHead className="text-right dark:text-gray-300">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStockList.map((item) => (
                      <TableRow key={item.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-gray-300">
                          {item.name}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 text-center">
                          {editingStock === item.id ? (
                            <Input
                              type="number"
                              value={newStockQuantity}
                              onChange={(e) => setNewStockQuantity(e.target.value)}
                              className="w-20"
                              min="0"
                            />
                          ) : (
                            <span className="font-semibold">{item.stock_quantity}</span>
                          )}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {editingStock === item.id ? (
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            formatCurrency(item.price)
                          )}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{item.category || '-'}</TableCell>
                        <TableCell className="max-w-xs">
                          <span
                            className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-medium ${
                              item.maturing_info
                                ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-200'
                                : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400'
                            }`}
                          >
                            {item.maturing_info || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                                    item.shopier_product_id
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                                  }`}
                                >
                                  {item.shopier_product_id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {item.shopier_product_id ? 'Eşleştirildi' : 'Eşleştirilmedi'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {!item.shopier_product_id && Number(item.stock_quantity) > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenCreateShopierModal(item)}
                                    className="h-8 w-8 bg-emerald-100 p-0 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Shopier'e ekle</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {editingStock === item.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleStockUpdate(item.id)}
                                  className="h-8 w-8 bg-emerald-600 px-0 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 bg-red-100 px-0 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingStock(item.id);
                                  setNewStockQuantity(item.stock_quantity.toString());
                                  setNewPrice(item.price?.toString() || '');
                                }}
                                className="h-8 w-8 bg-blue-100 p-0 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/70"
                                title="Stok Düzenle"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenMaturationModal(item)}
                              className="h-8 w-8 bg-emerald-100 p-0 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                              title="Demlenenler"
                            >
                              <Clock3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetailModal(item)}
                              className="h-8 w-8 bg-violet-50 p-0 text-violet-600 hover:bg-violet-100 hover:text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/50 dark:hover:text-violet-200"
                              title="Detaylar"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStorePerfume(item);
                                setSelectedProvider('shopier');
                                setStoreProducts([]);
                                setCurrentLinks(null);
                                setSelectedStoreProductId('');
                                setIsStoreModalOpen(true);
                              }}
                              className="h-8 w-8 bg-amber-100 p-0 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:hover:bg-amber-900/70"
                              title="Mağaza Ürün Eşleştirme"
                            >
                              <Store className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-center mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={(value) => {
                      setPageSize(value);
                      setCurrentPage(1);
                    }}
                    totalItems={totalItems}
                    pageSizeOptions={[25, 50, 100]}
                  />
                </div>
              </>
            )}
    </div>
  );

  return (
    <>
      {isPage ? (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Stok Yönetimi
            </h1>
          </div>
          {stockContent}
        </div>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Stok Yönetimi</DialogTitle>
            </DialogHeader>
            {stockContent}
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDetailModalOpen} onOpenChange={() => setIsDetailModalOpen(false)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parfüm Detayı</DialogTitle>
          </DialogHeader>
          {selectedDetailPerfume && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-white via-slate-50 to-amber-50 shadow-sm shadow-amber-100/60 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:shadow-none">
                <CardContent className="p-0">
                  <div className="border-b border-slate-200/80 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          <Sparkles className="h-3.5 w-3.5" />
                          Perfume Snapshot
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {selectedDetailPerfume.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {selectedDetailPerfume.category || 'Kategori bilgisi yok'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-100/80 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Stok
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {selectedDetailPerfume.stock_quantity}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-4 shadow-sm shadow-orange-100/80 dark:border-orange-900/60 dark:bg-orange-950/30 dark:shadow-none">
                      <p className="text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
                        Demlenmekte
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-orange-700 dark:text-orange-200">
                        {selectedDetailPerfume.maturing_quantity || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm shadow-emerald-100/80 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:shadow-none">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Maliyet
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-200">
                        {formatCurrency(selectedDetailPerfume.price)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 shadow-sm shadow-sky-100/80 dark:border-sky-900/60 dark:bg-sky-950/30 dark:shadow-none">
                      <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                        Shopier
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-sky-700 dark:text-sky-200">
                        {formatCurrency(selectedDetailPerfume.shopier_price)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 px-6 pb-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-100/80 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                      <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Nota Piramidi
                      </p>
                      <div className="space-y-3">
                        {detailNoteGroups.map((group) => (
                          <div
                            key={group.label}
                            className="rounded-xl bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100/60 dark:bg-slate-800/80 dark:shadow-none"
                          >
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              {group.label}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
                              {group.value || '-'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-100/80 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                      <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Satış Fiyatları
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100/60 dark:bg-slate-800/80 dark:shadow-none">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Dolap</span>
                          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(selectedDetailPerfume.dolap_price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100/60 dark:bg-slate-800/80 dark:shadow-none">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Elden</span>
                          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(selectedDetailPerfume.cash_price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100/60 dark:bg-slate-800/80 dark:shadow-none">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Shopier
                          </span>
                          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(selectedDetailPerfume.shopier_price)}
                          </span>
                        </div>
                        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-900/60 dark:bg-orange-950/30">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
                            Demlenme bilgisi
                          </p>
                          <span className="inline-flex max-w-full items-center rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-medium text-orange-700 shadow-sm dark:border-orange-800 dark:bg-orange-950/70 dark:text-orange-200">
                            {selectedDetailPerfume.maturing_info || 'Aktif demlenme kaydı yok'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm shadow-slate-100/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Shopier Bilgileri
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Stok adedi ve Shopier satis fiyati magaza urunune gonderilir.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      disabled={
                        loadingShopierDetail ||
                        updatingShopierProduct ||
                        !selectedDetailPerfume.shopier_product_id
                      }
                      onClick={handleUpdateShopierProduct}
                      className={`bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-300 ${
                        hasShopierPriceMismatch ? 'animate-pulse ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900' : ''
                      }`}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      {updatingShopierProduct ? 'Guncelleniyor...' : "Shopier'i Guncelle"}
                    </Button>
                  </div>

                  {shopierDetailError && (
                    <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                      {shopierDetailError}
                    </div>
                  )}

                  {hasShopierPriceMismatch && (
                    <div className="mx-6 mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                      Maliyet fiyatınızla Shopier fiyatı uyuşmamaktadır. Güncellemek için
                      Shopier'i Güncelle'ye tıklayın. Beklenen Shopier fiyatı:{' '}
                      {formatCurrency(expectedShopierPrice)}.
                    </div>
                  )}

                  <div className="space-y-5 px-6 py-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Shopier ID
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                          {loadingShopierDetail
                            ? 'Yukleniyor...'
                            : shopierDetail?.current?.product_id || 'Eslestirme yok'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Durum
                        </p>
                        {loadingShopierDetail ? (
                          <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                            Yukleniyor...
                          </p>
                        ) : (
                          <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${shopierStatusDisplay.className}`}
                          >
                            {shopierStatusDisplay.label}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="shopier-update-title">Ürün Adı</Label>
                        <Input
                          id="shopier-update-title"
                          value={shopierUpdateForm.title}
                          disabled={
                            loadingShopierDetail ||
                            updatingShopierProduct ||
                            !selectedDetailPerfume.shopier_product_id
                          }
                          onChange={(e) =>
                            setShopierUpdateForm((prev) => ({ ...prev, title: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shopier-update-price">Fiyat</Label>
                        <Input
                          id="shopier-update-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={shopierUpdateForm.price}
                          disabled={
                            loadingShopierDetail ||
                            updatingShopierProduct ||
                            !selectedDetailPerfume.shopier_product_id
                          }
                          onChange={(e) =>
                            setShopierUpdateForm((prev) => ({ ...prev, price: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shopier-update-stock">Adet</Label>
                        <Input
                          id="shopier-update-stock"
                          type="number"
                          min="0"
                          step="1"
                          value={shopierUpdateForm.stockQuantity}
                          disabled={
                            loadingShopierDetail ||
                            updatingShopierProduct ||
                            !selectedDetailPerfume.shopier_product_id
                          }
                          onChange={(e) =>
                            setShopierUpdateForm((prev) => ({
                              ...prev,
                              stockQuantity: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isMaturationModalOpen} onOpenChange={() => setIsMaturationModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Demlenenler</DialogTitle>
          </DialogHeader>
          {selectedMaturationPerfume && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/70">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Parfüm</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedMaturationPerfume.name}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setMaturingForm((prev) => ({
                      ...prev,
                      maturation_start_date: prev.maturation_start_date || getTodayInputDate(),
                    }));
                    setShowMaturationForm((prev) => !prev);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Ekle
                </Button>
              </div>

              {showMaturationForm && (
                <form
                  onSubmit={handleSubmitMaturation}
                  className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="quantity">Demlenen Miktar</Label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        required
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={maturingForm.quantity}
                        onChange={(e) =>
                          setMaturingForm((prev) => ({ ...prev, quantity: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maturation_start_date">Yapılma Tarihi</Label>
                      <input
                        id="maturation_start_date"
                        name="maturation_start_date"
                        type="date"
                        required
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={maturingForm.maturation_start_date}
                        onChange={(e) =>
                          setMaturingForm((prev) => ({
                            ...prev,
                            maturation_start_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Not</Label>
                    <input
                      id="notes"
                      name="notes"
                      type="text"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      value={maturingForm.notes}
                      onChange={(e) =>
                        setMaturingForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowMaturationForm(false)}
                    >
                      Vazgeç
                    </Button>
                    <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                      Kaydet
                    </Button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/70">
                    <tr>
                      <th className="px-3 py-3 text-left">Tarih</th>
                      <th className="px-3 py-3 text-left">Adet</th>
                      <th className="px-3 py-3 text-left">Not</th>
                      <th className="px-3 py-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maturationList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-400">
                          Kayıt yok
                        </td>
                      </tr>
                    ) : (
                      maturationList.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="px-3 py-3">
                            {item.maturation_start_date
                              ? new Date(item.maturation_start_date).toLocaleDateString('tr-TR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })
                              : '-'}
                          </td>
                          <td className="px-3 py-3">{item.quantity}</td>
                          <td className="px-3 py-3">{item.notes || '-'}</td>
                          <td className="px-3 py-3 text-right">
                            <button
                              onClick={() => handleCompleteMaturation(item.id)}
                              className="inline-flex items-center justify-center rounded bg-green-500 p-2 text-white hover:bg-green-600"
                              title="Stoklara Aktar"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateShopierModalOpen}
        onOpenChange={() => setIsCreateShopierModalOpen(false)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Shopier'e Ürün Ekle</DialogTitle>
          </DialogHeader>
          {selectedCreateShopierPerfume && (
            <form onSubmit={handleCreateShopierProduct} className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm text-slate-500 dark:text-slate-400">Stok Kaydı</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {selectedCreateShopierPerfume.name}
                </p>
              </div>

              {loadingShopierProductPreview ? (
                <div className="py-8 text-center text-sm text-slate-500">Yükleniyor...</div>
              ) : (
                <>
                  {shopierProductError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                      {shopierProductError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="shopier-title">Ürün Adı</Label>
                    <Input
                      id="shopier-title"
                      value={shopierProductForm.title}
                      onChange={(e) =>
                        setShopierProductForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopier-description">Ürün Açıklaması</Label>
                    <Textarea
                      id="shopier-description"
                      value={shopierProductForm.description}
                      onChange={(e) =>
                        setShopierProductForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="shopier-price">Fiyat</Label>
                      <Input
                        id="shopier-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={shopierProductForm.price}
                        onChange={(e) =>
                          setShopierProductForm((prev) => ({ ...prev, price: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shopier-stock">Stok</Label>
                      <Input
                        id="shopier-stock"
                        type="number"
                        min="0"
                        value={shopierProductForm.stockQuantity}
                        onChange={(e) =>
                          setShopierProductForm((prev) => ({
                            ...prev,
                            stockQuantity: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shopier-shipping-price">Kargo Ücreti</Label>
                      <Input
                        id="shopier-shipping-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={shopierProductForm.shippingPrice}
                        onChange={(e) =>
                          setShopierProductForm((prev) => ({
                            ...prev,
                            shippingPrice: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shopier-category-id">Shopier Kategori</Label>
                      <select
                        id="shopier-category-id"
                        value={shopierProductForm.categoryId}
                        onChange={(e) =>
                          setShopierProductForm((prev) => ({
                            ...prev,
                            categoryId: e.target.value,
                          }))
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-slate-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-slate-100"
                        required
                      >
                        <option value="">Kategori seçin</option>
                        {SHOPIER_CATEGORY_OPTIONS.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shopier-media-url">Görsel URL</Label>
                      <Input
                        id="shopier-media-url"
                        value={shopierProductForm.mediaUrl}
                        onChange={(e) =>
                          setShopierProductForm((prev) => ({
                            ...prev,
                            mediaUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={shopierProductForm.discount}
                      onChange={(e) =>
                        setShopierProductForm((prev) => ({
                          ...prev,
                          discount: e.target.checked,
                        }))
                      }
                    />
                    İndirim aktif
                  </label>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCreateShopierModalOpen(false)}
                    >
                      Vazgeç
                    </Button>
                    <Button
                      type="submit"
                      disabled={creatingShopierProduct}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {creatingShopierProduct ? 'Gönderiliyor...' : "Shopier'e Gönder"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isStoreModalOpen} onOpenChange={() => setIsStoreModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Mağaza Ürün Eşleştirme</DialogTitle>
          </DialogHeader>
          {selectedStorePerfume && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm text-slate-500 dark:text-slate-400">Parfüm Stoğu</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {selectedStorePerfume.name}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    disabled={!provider.enabled}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`rounded-xl border px-4 py-4 text-left ${selectedProvider === provider.id ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'} ${!provider.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <p className="font-semibold">{provider.label}</p>
                    <p className="mt-1 text-sm opacity-80">
                      {provider.enabled ? 'Ürün eşleştirme aktif' : 'Yakında aktif olacak'}
                    </p>
                  </button>
                ))}
              </div>

              <Card className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <CardContent className="p-6 space-y-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Shopier Eşleştirmesi
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="hidden">
                      <Label htmlFor="store-search">Shopier Ürünü Ara</Label>
                      <Input
                        id="store-search"
                        value=""
                        onChange={() => {}}
                        disabled={selectedProvider !== 'shopier'}
                        placeholder="Ürün adında ara..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-product">Shopier Ürünü</Label>
                      <select
                        id="store-product"
                        value={selectedStoreProductId}
                        onChange={(e) => handleSelectStoreProduct(e.target.value)}
                        disabled={
                          selectedProvider !== 'shopier' || loadingStoreProducts || savingStoreLink
                        }
                        className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="">
                          {loadingStoreProducts ? 'Yükleniyor...' : 'Ürün seçin'}
                        </option>
                        {storeProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Seçim yaptığınız anda Shopier ürün ID ve adı stok kaydına yazılır.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Mevcut Eşleşme
                          </p>
                          <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
                            {currentLinks?.shopier?.product_name || 'Henüz eşleştirilmedi'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={
                            selectedProvider !== 'shopier' ||
                            clearingStoreLink ||
                            !currentLinks?.shopier?.product_id
                          }
                          onClick={handleClearStoreLink}
                          className="h-8 w-8 shrink-0 bg-red-100 p-0 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70"
                          title="Eslestirmeyi sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Seçili Ürün
                      </p>
                      <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
                        {storeProducts.find((item) => item.id === selectedStoreProductId)?.name ||
                          'Seçilmedi'}
                      </p>
                    </div>
                  </div>

                  <div className="hidden">
                    <Button
                      type="button"
                      disabled={selectedProvider !== 'shopier' || savingStoreLink}
                      onClick={handleSaveStoreLink}
                      className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {savingStoreLink ? 'Kaydediliyor...' : 'Eşleştir'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StockManagementDialog;
