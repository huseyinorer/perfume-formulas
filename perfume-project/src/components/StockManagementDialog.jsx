import { Button } from "./ui/button";
import AddStockDialog from "./AddStockDialog";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Plus, Pencil, Search, Clock, Eye, Check, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useCallback } from "react";
import Pagination from "./Pagination";

const StockManagementDialog = ({ open, onOpenChange }) => {
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [isMaturingModalOpen, setIsMaturingModalOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [maturingForm, setMaturingForm] = useState({
    quantity: "",
    maturation_start_date: "",
    notes: "",
  });
  const [stockList, setStockList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [editingStock, setEditingStock] = useState(null);
  const [newStockQuantity, setNewStockQuantity] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const API_URL = import.meta.env.VITE_API_URL;

  // Modal open handler
  const handleOpenMaturingModal = (perfume) => {
    setSelectedPerfume(perfume);
    setMaturingForm({ quantity: "", maturation_start_date: "", notes: "" });
    setIsMaturingModalOpen(true);
  };
  // Modal close handler
  const handleCloseMaturingModal = () => {
    setIsMaturingModalOpen(false);
    setSelectedPerfume(null);
    setMaturingForm({ quantity: "", maturation_start_date: "", notes: "" });
  };
  // Input change handler
  const handleMaturingInputChange = (e) => {
    const { name, value } = e.target;
    setMaturingForm((prev) => ({ ...prev, [name]: value }));
  };
  // Submit handler
  const handleMaturingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPerfume) return;
    // Backend integration: send new maturing info
    try {
      // Example: POST to /perfume-stock/:id/maturing
      const response = await fetch(`${API_URL}/perfume-maturation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          perfume_id: selectedPerfume.perfume_id,
          quantity: Number(maturingForm.quantity),
          maturation_start_date: maturingForm.maturation_start_date,
          notes: maturingForm.notes,
        }),
      });
      if (response.ok) {
        // Refresh stock list or update UI
        fetchStockList();
        handleCloseMaturingModal();
      } else {
        alert("Demlenen eklenirken bir hata oluştu");
      }
    } catch (error) {
      alert("Demlenen eklenirken bir hata oluştu");
    }
  };  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (open) {
      fetchStockList();
    }
  }, [open, debouncedSearchTerm, currentPage, pageSize]);

  const fetchStockList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/perfume-stock?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Veri alınamadı");
      }
      const data = await response.json();
      setStockList(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id) => {
    if (!newStockQuantity || newStockQuantity < 0) {
      alert("Geçerli bir stok miktarı giriniz");
      return;
    }
    if (!newPrice || newPrice < 0) {
      alert("Geçerli bir maliyet giriniz");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/perfume-stock/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          stock_quantity: parseInt(newStockQuantity),
          price: parseFloat(newPrice),
        }),
      });

      if (response.ok) {
        setEditingStock(null);
        setNewStockQuantity("");
        setNewPrice("");
        fetchStockList();
      } else {
        alert("Stok güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Stok güncellenirken bir hata oluştu");
    }
  };

  const handleEditClick = (item) => {
    setEditingStock(item.id);
    setNewStockQuantity(item.stock_quantity.toString());
    setNewPrice(item.price?.toString() || "");
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setNewStockQuantity("");
    setNewPrice("");
  };

  const [isMaturationListModalOpen, setIsMaturationListModalOpen] =
    useState(false);
  const [maturationList, setMaturationList] = useState([]);
  const [selectedMaturationPerfume, setSelectedMaturationPerfume] =
    useState(null);

  const handleOpenMaturationListModal = useCallback(
    async (perfume) => {
      setSelectedMaturationPerfume(perfume);
      setIsMaturationListModalOpen(true);
      try {
        const response = await fetch(
          `${API_URL}/perfume-maturation/by-perfume-id/${perfume.perfume_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMaturationList(data);
        } else {
          setMaturationList([]);
        }
      } catch (e) {
        setMaturationList([]);
      }
    },
    [API_URL]
  );

  const handleCloseMaturationListModal = () => {
    setIsMaturationListModalOpen(false);
    setSelectedMaturationPerfume(null);
    setMaturationList([]);
  };

  const handleCompleteMaturation = async (maturationId) => {
    try {
      const response = await fetch(
        `${API_URL}/perfume-maturation/${maturationId}/complete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        setMaturationList((prev) => prev.filter((m) => m.id !== maturationId));
        fetchStockList(); // stok güncelle
      }
    } catch (e) {}
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortBy(null);
        setSortDirection("asc"); // default direction
      }
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedStockList = sortBy
    ? [...stockList].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        // String sıralama için
        if (["category", "name"].includes(sortBy)) {
          aValue = (aValue || "").toLocaleLowerCase();
          bValue = (bValue || "").toLocaleLowerCase();
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        } else {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
      })
    : stockList;

  // Eklenen state
  const [newPrice, setNewPrice] = useState("");

  return (
    <>      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stok Yönetimi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Parfüm ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-4 mb-4">
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
                        className="dark:text-gray-300 cursor-pointer select-none"
                        onClick={() => handleSort("name")}
                      >
                        <span className="flex items-center gap-1">
                          Parfüm Adı
                          {sortBy === "name"
                            ? (sortDirection === "asc"
                                ? <ArrowUp className="w-3 h-3 inline text-blue-500" />
                                : <ArrowDown className="w-3 h-3 inline text-blue-500" />)
                            : <ArrowUpDown className="w-3 h-3 inline text-gray-400" />}
                        </span>
                      </TableHead>
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer select-none"
                        onClick={() => handleSort("stock_quantity")}
                      >
                        <span className="flex items-center gap-1">
                          Stok Miktarı
                          {sortBy === "stock_quantity"
                            ? (sortDirection === "asc"
                                ? <ArrowUp className="w-3 h-3 inline text-blue-500" />
                                : <ArrowDown className="w-3 h-3 inline text-blue-500" />)
                            : <ArrowUpDown className="w-3 h-3 inline text-gray-400" />}
                        </span>
                      </TableHead>
                      <TableHead className="dark:text-gray-300">
                        Demlenen Miktar
                      </TableHead>
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer select-none"
                        onClick={() => handleSort("price")}
                      >
                        <span className="flex items-center gap-1">
                          Maliyet
                          {sortBy === "price"
                            ? (sortDirection === "asc"
                                ? <ArrowUp className="w-3 h-3 inline text-blue-500" />
                                : <ArrowDown className="w-3 h-3 inline text-blue-500" />)
                            : <ArrowUpDown className="w-3 h-3 inline text-gray-400" />}
                        </span>
                      </TableHead>
                      <TableHead
                        className="dark:text-gray-300 cursor-pointer select-none"
                        onClick={() => handleSort("category")}
                      >
                        <span className="flex items-center gap-1">
                          Kategori
                          {sortBy === "category"
                            ? (sortDirection === "asc"
                                ? <ArrowUp className="w-3 h-3 inline text-blue-500" />
                                : <ArrowDown className="w-3 h-3 inline text-blue-500" />)
                            : <ArrowUpDown className="w-3 h-3 inline text-gray-400" />}
                        </span>
                      </TableHead>
                      <TableHead className="dark:text-gray-300">
                        Demlenme Bilgisi
                      </TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        İşlemler
                      </TableHead>
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
                            <span className="font-semibold">
                              {item.stock_quantity}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 text-center">
                          <span className="font-semibold text-orange-600">
                            {item.maturing_quantity || 0}
                          </span>
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
    <>₺{item.price}</>
  )}
</TableCell>
                        <TableCell className="dark:text-gray-300">
                          {item.category || "-"}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 max-w-xs">
                          {item.maturing_info ? (
                            <div className="text-xs text-orange-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <div className="flex flex-col">
                                {item.maturing_info
                                  .split("/")
                                  .map((info, idx) => (
                                    <span
                                      key={idx}
                                      className="truncate"
                                      title={info.trim()}
                                    >
                                      {info.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
  <div className="flex gap-2 justify-end">
    {editingStock === item.id ? (
  <>
    <Button
  size="sm"
  onClick={() => handleStockUpdate(item.id)}
  className="bg-green-500 hover:bg-green-600 text-white px-2 flex items-center justify-center dark:bg-green-600 dark:hover:bg-green-500 dark:text-white"
  title="Onayla"
>
  <Check className="h-4 w-4" />
</Button>
<Button
  size="sm"
  variant="ghost"
  onClick={handleCancelEdit}
  className="bg-red-100 hover:bg-red-200 text-red-600 px-2 flex items-center justify-center dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-200"
  title="İptal"
>
  <X className="h-4 w-4" />
</Button>
  </>
) : (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleEditClick(item)}
    className="bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50"
    title="Stok Düzenle"
  >
    <Pencil className="h-4 w-4" />
  </Button>
)}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleOpenMaturingModal(item)}
      className="bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50"
      title="Demlenen Ekle"
    >
      <Plus className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleOpenMaturationListModal(item)}
      className="bg-yellow-50 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/50"
      title="Demlenenleri Listele"
    >
      <Eye className="h-4 w-4" />
    </Button>
  </div>
</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex justify-center mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    totalItems={totalItems}
                  />
                </div>

                {stockList.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    {debouncedSearchTerm
                      ? "Arama kriterinize uygun sonuç bulunamadı"
                      : "Henüz stok kaydı bulunmuyor"}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Toplam {stockList.length} stok kaydı
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Demlenen Ekle Modal */}
      <Dialog open={isMaturingModalOpen} onOpenChange={setIsMaturingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demlenen Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMaturingSubmit} className="space-y-4">
            <div>
              <Label>Parfüm</Label>
              <div className="font-semibold text-sm mt-1">
                {selectedPerfume?.name || ""}
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">Demlenen Miktar</Label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                required
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2 mt-1"
                value={maturingForm.quantity}
                onChange={handleMaturingInputChange}
              />
            </div>
            <div>
              <Label htmlFor="maturation_start_date">Yapılma Tarihi</Label>
              <input
                id="maturation_start_date"
                name="maturation_start_date"
                type="date"
                required
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2 mt-1"
                value={maturingForm.maturation_start_date}
                onChange={handleMaturingInputChange}
              />
            </div>
            <div>
              <Label htmlFor="note">Not</Label>
              <input
                id="notes"
                name="notes"
                type="text"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 rounded px-3 py-2 mt-1"
                value={maturingForm.notes}
                onChange={handleMaturingInputChange}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={handleCloseMaturingModal}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Kaydet
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Demlenmekte Olanlar Dialogu --- */}
      <Dialog
        open={isMaturationListModalOpen}
        onOpenChange={handleCloseMaturationListModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Demlenmekte Olanlar</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">
                    Tarih
                  </th>
                  <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">
                    Adet
                  </th>
                  <th className="px-3 py-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {maturationList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-4 text-gray-400 dark:text-gray-500"
                    >
                      Kayıt yok
                    </td>
                  </tr>
                ) : (
                  maturationList.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                        {m.maturation_start_date ? new Date(m.maturation_start_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                        {m.quantity}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleCompleteMaturation(m.id)}
                          className="inline-flex items-center justify-center rounded bg-green-500 hover:bg-green-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                          title="Onayla"
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
        </DialogContent>
      </Dialog>
    </>
  );
};
export default StockManagementDialog;


