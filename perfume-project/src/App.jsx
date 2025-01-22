import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import AddFormulaDialog from "./components/AddFormulaDialog";
import PendingFormulasDialog from "./components/PendingFormulasDialog";
import SearchBox from "./components/SearchBox";
import { Trash2 } from "lucide-react";
import Pagination from "./components/Pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { PerfumeGuideDialog } from "./components/PerfumeGuideDialog";
import { Sparkles, HelpCircle } from "lucide-react";
import { HeartHandshake } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import Footer from "./components/Footer";
import UserMenu from "./components/UserMenu";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import RegisterDialog from "./components/RegisterDialog";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";
import LoginDialog from "./components/LoginDialog";
import axios from "axios";
import PerfumeManagementDialog from "./components/PerfumeManagementDialog";
import PerfumeCard from "./components/PerfumeCard";
import FavoritesDialog from "./components/FavoritesDialog";
import FAQDialog from './components/FAQDialog';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [creativeFormula, setCreativeFormula] = useState(null);
  const [user, setUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("brand");
  const [sortOrder, setSortOrder] = useState("asc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddPerfumeOpen, setIsAddPerfumeOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPerfumeManagementOpen, setIsPerfumeManagementOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
        setIsLoggedIn(true);
        setIsAdmin(payload.isAdmin === true);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const fetchPendingRequests = async () => {
    if (!isAdmin === true) return;
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
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('token') ? 
              `Bearer ${localStorage.getItem("token")}` : undefined,
          },
        }
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

  const fetchCreativeFormula = async (perfumeId) => {
    try {
      const response = await fetch(`${API_URL}/perfumes/${perfumeId}/details`);
      const data = await response.json();
      setCreativeFormula(data);
    } catch (error) {
      console.error("Error fetching creative formula:", error);
    }
  };

  const handleRowClick = async (perfume) => {
    setSelectedPerfume(perfume);
    await Promise.all([
      fetchFormulas(perfume.id),
      fetchCreativeFormula(perfume.id),
    ]);
    setIsFormulaDialogOpen(true);
  };

  const handleSearch = (value) => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleFormulaSubmit = async (formulaData) => {
    if (isAdmin) {
      await handleSaveFormula(formulaData);
    } else {
      await handleFormulaRequest(formulaData);
    }
  };

  const handleFormulaRequest = async (formulaData) => {
    try {
      const response = await fetch(`${API_URL}/formulas/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: isLoggedIn
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
        },
        body: JSON.stringify({
          ...formulaData,
          userId: user?.id || null, // Eğer user varsa id'sini, yoksa null gönder
        }),
      });

      if (response.ok) {
        alert(
          "Formül isteğiniz başarıyla gönderildi. Admin onayından sonra eklenecektir."
        );
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const handleLogin = async (response) => {
    const { token, user } = response;
    localStorage.setItem("token", token);
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(user.isAdmin === true);
    setIsLoginOpen(false);
    
    // Login olduktan sonra parfümleri yeniden çek
    await fetchPerfumes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleFooterGuideClick = () => {
    setIsGuideOpen(true);
  };

  const handleFooterAddFormulaClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleFooterFAQClick = () => {
    setIsFAQOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler eşleşmiyor");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        alert("Şifre başarıyla değiştirildi");
        setIsChangePasswordOpen(false);
        // Form alanlarını temizle
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Şifre değiştirme başarısız");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Bir hata oluştu");
    }
  };

  // Dialog'ları kapatma fonksiyonları
  const handleCloseDialog = (setterFunction) => {
    setterFunction(false);
    // Tüm dialog'ları kapatıyoruz
    setIsAddDialogOpen(false);
    setIsPendingDialogOpen(false);
    setIsChangePasswordOpen(false);
    setIsGuideOpen(false);
    setIsLoginOpen(false);
  };

  // API istekleri için axios instance oluştur
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Her istekte token'ı ekle
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Token expire olduğunda otomatik logout
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleLogout();
      }
      return Promise.reject(error);
    }
  );

  const handleFavoriteToggle = async (perfumeId) => {
    if (!isLoggedIn) {
      alert("Favorilere eklemek için giriş yapmalısınız");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ perfume_id: perfumeId }),
      });

      if (response.ok) {
        // Parfüm listesini güncelle
        fetchPerfumes();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1800px] mx-auto p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-3 rounded-lg">
                <h1 className="text font-bold text-white">
                  Parfüm Formülleri
                  {isAdmin === true && (
                    <span className="text-sm ml-2 bg-red-500 text-white px-2 py-1 rounded-full">
                      Admin Panel
                    </span>
                  )}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className={`
                  ${
                    isAdmin === true
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  }
                  text-white shadow-md hover:shadow-xl 
                  transform hover:-translate-y-0.5 
                  transition-all duration-200 
                  flex items-center gap-2
                  min-w-[200px] justify-center
                `}
              >
                <HeartHandshake className="h-5 w-5" />
                {isAdmin === true
                  ? "Yeni Formül Ekle"
                  : "Kendi Formülümü Paylaşmak İstiyorum ♥"}
              </Button>

              <Button
                onClick={() => setIsGuideOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                  hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-xl 
                  transform hover:-translate-y-0.5 transition-all duration-900 
                  animate-pulse hover:animate-none flex items-center gap-2
                  min-w-[180px] justify-center"
              >
                <Sparkles className="h-4 w-4" />
                Nasıl Parfüm Yapılır?
              </Button>

              <Button
                onClick={() => setIsFAQOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white 
                  hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-xl 
                  transform hover:-translate-y-0.5 transition-all duration-200
                  flex items-center gap-2 min-w-[180px] justify-center"
              >
                <HelpCircle className="h-4 w-4" />
                Sık Sorulan Sorular
              </Button>

              {isLoggedIn ? (
                <>
                  <UserMenu
                    pendingRequestsCount={pendingRequests.length}
                    onPendingRequestsClick={() => setIsPendingDialogOpen(true)}
                    onAddPerfumeClick={() => setIsPerfumeManagementOpen(true)}
                    onChangePasswordClick={() => setIsChangePasswordOpen(true)}
                    onLogout={handleLogout}
                    username={user?.username}
                    isAdmin={isAdmin}
                    onFavoritesClick={() => setIsFavoritesOpen(true)}
                  />
                  <ThemeToggle />
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white 
                      flex items-center gap-2 shadow-md hover:shadow-xl
                      transform hover:-translate-y-0.5
                      transition-all duration-1200"
                  >
                    <LogIn className="h-4 w-4" />
                    Giriş Yap
                  </Button>
                  <Button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white 
                      flex items-center gap-2 shadow-md hover:shadow-xl
                      transform hover:-translate-y-0.5
                      transition-all duration-1200"
                  >
                    <UserPlus className="h-4 w-4" />
                    Üye Ol
                  </Button>
                  <ThemeToggle />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto mb-4">
            <SearchBox
              onSearch={(value) => setSearchTerm(value)}
              className="w-full"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
              {perfumes.slice(0, 20).map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onClick={() => handleRowClick(perfume)}
                  onFormulaRequest={() => setIsAddDialogOpen(true)}
                  onFavoriteToggle={handleFavoriteToggle}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            {perfumes.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Aranan kriterlere uygun parfüm bulunamadı.
              </div>
            )}

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                totalItems={totalItems}
              />
            </div>
          </div>
        </div>
        <Dialog
          open={isFormulaDialogOpen}
          onOpenChange={setIsFormulaDialogOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPerfume?.brand} - {selectedPerfume?.name} Formülleri
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {creativeFormula && (
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="creative-formula"
                >
                  <AccordionItem value="creative-formula">
                    <AccordionTrigger className="text-sm font-medium text-gray-600">
                      Parfüm Bilgileri
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg dark:bg-gray-800/50">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Marka:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.brand}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            İsim:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.name}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Koku Ailesi:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.olfactive_family}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Tip:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.type}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Piramit Notu:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.pyramid_note}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Üst Notalar:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.top_notes}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Orta Notalar:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.middle_notes}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Alt Notalar:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.base_notes}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            Önerilen Kullanım Oranı:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {creativeFormula.recommended_usage}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              <h3 className="text-lg font-semibold mb-4 mt-5 text-left">
                Parfüm severler nasıl yaptı ♥
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Esans %</TableHead>
                    <TableHead>Alkol %</TableHead>
                    <TableHead>Su %</TableHead>
                    <TableHead>Dinlenme (Gün)</TableHead>
                    {isAdmin === true && (
                      <TableHead className="w-[100px]">İşlemler</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formulas.map((formula) => (
                    <TableRow key={formula.id}>
                      <TableCell>{formula.fragrancePercentage}%</TableCell>
                      <TableCell>{formula.alcoholPercentage}%</TableCell>
                      <TableCell>{formula.waterPercentage}%</TableCell>
                      <TableCell>{formula.restDay}</TableCell>
                      {isAdmin === true && (
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
                      <TableCell
                        colSpan={isAdmin === true ? 5 : 4}
                        className="text-center text-gray-500"
                      >
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
          onClose={() => handleCloseDialog(setIsAddDialogOpen)}
          onSave={handleFormulaSubmit}
          perfumes={perfumes}
        />
        <LoginDialog
          open={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onLogin={handleLogin}
        />
        {isAdmin === true && (
          <PendingFormulasDialog
            open={isPendingDialogOpen}
            onClose={() => handleCloseDialog(setIsPendingDialogOpen)}
            requests={pendingRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}
        <PerfumeGuideDialog
          open={isGuideOpen}
          onClose={() => handleCloseDialog(setIsGuideOpen)}
        />
        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
          user={user}
        />
        <RegisterDialog
          open={isRegisterOpen}
          onOpenChange={setIsRegisterOpen}
        />
        <PerfumeManagementDialog
          open={isPerfumeManagementOpen}
          onOpenChange={setIsPerfumeManagementOpen}
        />
        <FavoritesDialog
          open={isFavoritesOpen}
          onOpenChange={setIsFavoritesOpen}
          onFavoriteToggle={handleFavoriteToggle}
        />
        <FAQDialog 
          open={isFAQOpen} 
          onOpenChange={setIsFAQOpen}
        />
      </div>

      <Footer
        onGuideClick={handleFooterGuideClick}
        onAddFormulaClick={handleFooterAddFormulaClick}
        onFAQClick={handleFooterFAQClick}
      />
    </div>
  );
}

export default App;
