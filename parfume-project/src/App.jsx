import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import AddFormulaDialog from "./components/AddFormulaDialog";
import PendingFormulasDialog from "./components/PendingFormulasDialog";
import SearchBox from "./components/SearchBox";
import { Trash2 } from "lucide-react";
import AdminLogin from "./components/AdminLogin";
import Pagination from "./components/Pagination";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false); // formül detayları için
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false); // admin girişi için

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("brandName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPerfumes();
    if (isAdmin) {
      fetchPendingRequests();
    }
  }, [currentPage, pageSize, sortBy, sortOrder, debouncedSearchTerm, isAdmin]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const fetchPendingRequests = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`${API_URL}/formulas/pending`);
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const fetchFormulas = async (perfumeId) => {
    try {
      const response = await fetch(`${API_URL}/perfumes/${perfumeId}/formulas`);
      const data = await response.json();
      setFormulas(data);
    } catch (error) {
      console.error("Error fetching formulas:", error);
    }
  };

  const fetchPerfumes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/perfumes?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}${
          debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ""
        }`
      );
      const data = await response.json();
      setPerfumes(data.data);
      setFilteredPerfumes(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    }
  };

  const handleRowClick = async (perfume) => {
    setSelectedPerfume(perfume);
    await fetchFormulas(perfume.id);
    setIsFormulaDialogOpen(true);
  };

  const handleSearch = (value) => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleFormulaRequest = async (formulaData) => {
    try {
      const response = await fetch(`${API_URL}/formulas/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulaData),
      });

      if (response.ok) {
        alert("Formül isteğiniz başarıyla gönderildi. Admin onayından sonra eklenecektir.");
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving formula request:", error);
    }
  };

  const handleSaveFormula = async (formulaData) => {
    try {
      const response = await fetch(`${API_URL}/formulas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulaData),
      });

      if (response.ok) {
        fetchPerfumes();
        if (selectedPerfume) {
          fetchFormulas(selectedPerfume.id);
        }
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving formula:", error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/formulas/approve/${requestId}`, {
        method: "POST",
      });
      if (response.ok) {
        fetchPendingRequests();
        fetchPerfumes();
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
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

  const handleDeleteFormula = async (formulaId, event) => {
    event.stopPropagation();

    if (window.confirm("Bu formülü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`${API_URL}/formulas/${formulaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          if (selectedPerfume) {
            fetchFormulas(selectedPerfume.id);
          }
          fetchPerfumes();
        }
      } catch (error) {
        console.error("Error deleting formula:", error);
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parfüm Formülleri {isAdmin && "(Admin Panel)"}</h1>
        <div className="flex gap-4">
          {!isAdmin && (
            <Button variant="outline" onClick={() => setIsAdminLoginOpen(true)}>
              Admin Girişi
            </Button>
          )}
          {isAdmin && pendingRequests.length > 0 && (
            <Button variant="outline" onClick={() => setIsPendingDialogOpen(true)}>
              Bekleyen İstekler ({pendingRequests.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>Yeni Formül {!isAdmin && "İsteği"} Ekle</Button>
          {isAdmin && (
            <Button variant="outline" onClick={handleLogout}>
              Çıkış
            </Button>
          )}
        </div>
      </div>
      <div className="max-w-2xl mx-auto mb-4">
    <SearchBox onSearch={(value) => setSearchTerm(value)} className="w-full" />
  </div>
      <div className="bg-white rounded-lg shadow max-w-2xl mx-auto">
        {" "}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("brandName")}>
                Marka {sortBy === "brandName" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                İsim {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Formül Sayısı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPerfumes.map((perfume) => (
              <TableRow key={perfume.id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleRowClick(perfume)}>
                <TableCell>{perfume.brandName}</TableCell>
                <TableCell>{perfume.name}</TableCell>
                <TableCell>{parseInt(perfume.formulaCount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={totalItems}
        />
        {filteredPerfumes.length === 0 && <div className="p-4 text-center text-gray-500">Aranan kriterlere uygun parfüm bulunamadı.</div>}
      </div>
      <Dialog open={isFormulaDialogOpen} onOpenChange={setIsFormulaDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPerfume?.brandName} - {selectedPerfume?.name} Formülleri
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Esans %</TableHead>
                  <TableHead>Alkol %</TableHead>
                  <TableHead>Su %</TableHead>
                  <TableHead>Dinlenme (Gün)</TableHead>
                  {isAdmin && <TableHead className="w-[100px]">İşlemler</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {formulas.map((formula) => (
                  <TableRow key={formula.id}>
                    <TableCell>{formula.fragrancePercentage}%</TableCell>
                    <TableCell>{formula.alcoholPercentage}%</TableCell>
                    <TableCell>{formula.waterPercentage}%</TableCell>
                    <TableCell>{formula.restDay}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 hover:text-red-600"
                          onClick={(e) => handleDeleteFormula(formula.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {formulas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-gray-500">
                      Henüz formül eklenmemiş.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      <AddFormulaDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={isAdmin ? handleSaveFormula : handleFormulaRequest}
        perfumes={perfumes}
        isAdmin={isAdmin}
      />
      <AdminLogin open={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLogin={handleLoginSuccess} />
      {isAdmin && (
        <PendingFormulasDialog
          open={isPendingDialogOpen}
          onClose={() => setIsPendingDialogOpen(false)}
          requests={pendingRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onSuccess={fetchPendingRequests}
        />
      )}
    </div>
  );
}

export default App;
