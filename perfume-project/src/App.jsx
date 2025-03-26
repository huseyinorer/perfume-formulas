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
import FAQDialog from "./components/FAQDialog";
import { MessageSquare } from "lucide-react";
import StarRating from "./components/ui/starRating";
import FormulaComments from "./components/FormulaComments";

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
  const [selectedFormulaId, setSelectedFormulaId] = useState(null);
  const [showComments, setShowComments] = useState(false);

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
    loadUserFromToken();
  }, []);

  // 2. Token tabanlı kullanıcı kontrolü fonksiyonu
  const loadUserFromToken = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      // JWT token decode etme
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        console.error("Invalid token format");
        handleLogout();
        return;
      }

      // Base64 decode işlemi
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // Token expire kontrolü
      const expirationTime = payload.exp * 1000;

      if (Date.now() >= expirationTime) {
        console.log("Token expired, logging out");
        handleLogout();
        return;
      }

      // Token geçerli, kullanıcıyı set et
      setUser(payload);
      setIsLoggedIn(true);
      setIsAdmin(!!payload.isAdmin);

      // Token süresi dolmadan önce otomatik logout için timer
      // Ancak bunu sayfa yenilendiğinde gerekmeyecek şekilde ayarlayalım
      const timeUntilExpiry = expirationTime - Date.now();
      // Otomatik logout için timeout kur - süre çok uzun olduğunda
      // JS'in maksimum setTimeout sınırını aşabileceği için 1 saatlik kontrollerle yapalım
      const maxTimeout = Math.min(timeUntilExpiry, 60 * 60 * 1000); // 1 saat veya token süresinin dolmasına kalan süre

      // Timer ile kontrol et
      const timer = setTimeout(() => {
        // Yeniden token kontrolü yap (1 saat sonra)
        loadUserFromToken();
      }, maxTimeout);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error parsing token:", error);
      handleLogout();
    }
  };

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
      // Fetch headers oluşturma
      const headers = {
        "Content-Type": "application/json",
      };

      // Token varsa Authorization header ekle
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/perfumes?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}${
          debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ""
        }`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        // Token sorunlarını kontrol et
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

    // Token'ı localStorage'a kaydet
    localStorage.setItem("token", token);

    // User state'i güncelle
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(user.isAdmin === true);
    setIsLoginOpen(false);

    // Login olduktan sonra parfümleri yeniden çek
    await fetchPerfumes();
  };

  const handleLogout = () => {
    // Token'ı localStorage'dan sil
    localStorage.removeItem("token");

    // State'i temizle
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
        // Seçili parfümün favori durumunu güncelle
        setSelectedPerfume((prev) => ({
          ...prev,
          is_favorite: !prev.is_favorite,
        }));
        // Parfüm listesini güncelle
        fetchPerfumes();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleOpenComments = (formula, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Eğer aynı formülün yorumlarına tıklandıysa kapat
    if (selectedFormulaId === formula.id && showComments) {
      setShowComments(false);
      setSelectedFormulaId(null);
    } else {
      // Farklı bir formülün yorumlarına tıklandıysa veya ilk kez tıklandıysa aç
      setSelectedFormulaId(formula.id);
      setShowComments(true);
    }
  };

  const handleRatingChange = (formulaId, averageRating, reviewCount) => {
    // Formüller listesindeki ilgili formülü güncelle
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
          onOpenChange={(open) => {
            setIsFormulaDialogOpen(open);
            if (!open) setShowComments(false); // Modal kapandığında yorumları gizle
          }}
        >
          <DialogContent
            className={`${
              showComments ? "max-w-7xl w-full" : "max-w-3xl"
            } transition-all duration-300 ease-in-out overflow-hidden`}
          >
            <DialogHeader className="flex flex-row justify-between items-center">
              <div>
                <DialogTitle>
                  {selectedPerfume?.brand} - {selectedPerfume?.name} Formülleri
                </DialogTitle>
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavoriteToggle(selectedPerfume?.id)}
                    className="mt-2 flex items-center gap-2 hover:bg-transparent p-2 w-[160px] justify-start"
                  >
                    <div
                      className={`
              transform transition-all duration-300
              ${selectedPerfume?.is_favorite ? "scale-110" : "scale-100"}
            `}
                    >
                      {selectedPerfume?.is_favorite ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-red-500 animate-heartBeat"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-muted-foreground"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedPerfume?.is_favorite
                        ? "Favoriden Çıkar"
                        : "Favoriye Ekle"}
                    </span>
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="flex h-full">
              {/* Ana içerik bölümü - her zaman görünür */}
              <div
                className={`${
                  showComments ? "w-8/12 pr-4 border-r" : "w-full"
                } transition-all duration-300`}
              >
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
                        <TableHead>Eklenme Tar.</TableHead>
                        <TableHead>Esans %</TableHead>
                        <TableHead>Alkol %</TableHead>
                        <TableHead>Su %</TableHead>
                        <TableHead>Dinlenme (Gün)</TableHead>
                        <TableHead>Değerlendirme</TableHead>
                        {/* İşlemler sütunu (admin için) */}
                        {isAdmin === true && (
                          <TableHead className="w-[100px]">İşlemler</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formulas.map((formula) => (
                        
                          <TableRow 
                            key={formula.id}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                            onClick={(e) => handleOpenComments(formula, e)}
                          >
                          <TableCell>
                            {formula.created_at ? 
                              new Date(formula.created_at).toLocaleDateString('tr-TR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }).replace(/\//g, '.') 
                              : ''}
                          </TableCell>
                          <TableCell>{formula.fragrancePercentage}%</TableCell>
                          <TableCell>{formula.alcoholPercentage}%</TableCell>
                          <TableCell>{formula.waterPercentage}%</TableCell>
                          <TableCell>{formula.restDay}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <StarRating
                                rating={formula.averageRating || 0}
                                reviewCount={formula.reviewCount || 0}
                              />
                              {isLoggedIn && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1 relative hover:bg-transparent"
                                  onClick={(e) => handleOpenComments(formula, e)}
                                >
                                  <MessageSquare className="h-4 w-4 text-blue-500" />
                                  {formula.reviewCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                      {formula.reviewCount}
                                    </span>
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          {isAdmin === true && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) =>
                                  handleDeleteFormula(formula.id, e)
                                }
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {formulas.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={isAdmin === true ? 6 : 5}
                            className="text-center text-gray-500"
                          >
                            Henüz formül eklenmemiş.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Yorumlar bölümü - showComments true olduğunda görünür */}
              {showComments && (
                <div className="w-4/12 pl-4 transition-all duration-300 h-[700px] overflow-hidden">
                  <FormulaComments
                    formulaId={selectedFormulaId}
                    userId={user?.id}
                    isAdmin={isAdmin}
                    selectedFormula={formulas.find(f => f.id === selectedFormulaId)}
                    onRatingChange={(averageRating, reviewCount) =>
                      handleRatingChange(
                        selectedFormulaId,
                        averageRating,
                        reviewCount
                      )
                    }
                  />
                </div>
              )}
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
          onRowClick={handleRowClick}
        />
        <FAQDialog open={isFAQOpen} onOpenChange={setIsFAQOpen} />
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
