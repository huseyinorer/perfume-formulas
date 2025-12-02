import React, { useState } from "react";
import { Button } from "./components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import AddFormulaDialog from "./components/AddFormulaDialog.jsx";
import PendingFormulasDialog from "./components/PendingFormulasDialog.jsx";
import SearchBox from "./components/SearchBox";
import Pagination from "./components/Pagination.jsx";
import { PerfumeGuideDialog } from "./components/PerfumeGuideDialog.jsx";
import { Sparkles, HelpCircle, HeartHandshake, LogIn, UserPlus, Trash2, MessageSquare, Heart } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import UserMenu from "./components/UserMenu.jsx";
import ChangePasswordDialog from "./components/ChangePasswordDialog.jsx";
import RegisterDialog from "./components/RegisterDialog.jsx";
import LoginDialog from "./components/LoginDialog.jsx";
import PerfumeManagementDialog from "./components/PerfumeManagementDialog.jsx";
import StockManagementDialog from "./components/StockManagementDialog.jsx";
import PerfumeCard from "./components/PerfumeCard.jsx";
import FavoritesDialog from "./components/FavoritesDialog.jsx";
import FAQDialog from "./components/FAQDialog.jsx";
import FormulaComments from "./components/FormulaComments.jsx";
import StarRating from "./components/ui/starRating.jsx";
import { Layout } from "./components/Layout";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { usePerfumes } from "./hooks/usePerfumes";
import { useFormulas } from "./hooks/useFormulas";
import { useAdmin } from "./hooks/useAdmin";
import { Perfume, FormulaRequest } from "./types/api.types";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  // Hooks
  const { user, isLoggedIn, isAdmin, handleLogin, handleLogout } = useAuth();
  const {
    perfumes,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    handleSearch,
    fetchPerfumes
  } = usePerfumes();
  
  const {
    formulas,
    creativeFormula,
    fetchFormulas,
    fetchCreativeFormula,
    handleSaveFormula,
    handleFormulaRequest,
    handleDeleteFormula,
    handleRatingChange
  } = useFormulas(isLoggedIn, user?.id);

  const {
    pendingRequests,
    handleApproveRequest,
    handleRejectRequest
  } = useAdmin(isAdmin);

  // Local UI State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPerfumeManagementOpen, setIsPerfumeManagementOpen] = useState(false);
  const [isStockManagementOpen, setIsStockManagementOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [selectedFormulaId, setSelectedFormulaId] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Handlers
  const handleRowClick = async (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    await Promise.all([
      fetchFormulas(perfume.id),
      fetchCreativeFormula(perfume.id),
    ]);
    setIsFormulaDialogOpen(true);
  };

  const handleFormulaSubmit = async (formulaData: FormulaRequest) => {
    if (isAdmin) {
      await handleSaveFormula(formulaData, () => {
        fetchPerfumes();
        if (selectedPerfume) {
          fetchFormulas(selectedPerfume.id);
        }
        setIsAddDialogOpen(false);
      });
    } else {
      await handleFormulaRequest(formulaData, () => {
        setIsAddDialogOpen(false);
      });
    }
  };

  const handleFavoriteToggle = async (perfume_id: number) => {
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
        body: JSON.stringify({ perfume_id: perfume_id }),
      });

      if (response.ok) {
        // Update selected perfume if it's the one being toggled
        if (selectedPerfume && selectedPerfume.id === perfume_id) {
            setSelectedPerfume((prev) => prev ? ({
                ...prev,
                is_favorite: !prev.is_favorite,
              }) : null);
        }
        // Refresh perfumes list
        fetchPerfumes();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleOpenComments = (formula: any, event: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (selectedFormulaId === formula.id && showComments) {
      setShowComments(false);
      setSelectedFormulaId(null);
    } else {
      setSelectedFormulaId(formula.id);
      setShowComments(true);
    }
  };

  return (
    <Layout>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-3 rounded-lg">
                <h1 className="text font-bold text-white">
                  Parfüm Formülleri
                  {isAdmin && (
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
                  ${isAdmin
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
                {isAdmin
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
                    onStockManagementClick={() => setIsStockManagementOpen(true)}
                    onChangePasswordClick={() => setIsChangePasswordOpen(true)}
                    onLogout={handleLogout}
                    username={user?.username || ""}
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            {/* Ikas Store Banner - 6 grid */}
            <div className="md:col-span-6">
              <a
                href="https://soultraceperfumes.ikas.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg p-4 transform transition-transform hover:scale-102 hover:shadow-xl h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">Satış Mağazamız</h3>
                      <p className="text-sm opacity-90">Kendi yaptığımız parfümleri keşfedin</p>
                    </div>
                    <div className="bg-white rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Etiket Tasarla Banner - 6 grid */}
            <div className="md:col-span-6">
              <a
                href="/label-designer.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-lg p-4 transform transition-transform hover:scale-102 hover:shadow-xl h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">Etiket Oluştur</h3>
                      <p className="text-sm opacity-90">Kendi özel parfüm etiketinizi hızlıca oluşturun</p>
                    </div>
                    <div className="bg-white rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-4">
            <SearchBox
              onSearch={(value: string) => handleSearch(value)}
              className="w-full"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
              {perfumes.map((perfume) => (
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
          onOpenChange={(open: boolean) => {
            setIsFormulaDialogOpen(open);
            if (!open) setShowComments(false);
          }}
        >
          <DialogContent 
            className={`${
              showComments ? "max-w-5xl" : "max-w-4xl"
            } max-h-[90vh] overflow-hidden transition-all duration-300`}
          >
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  {selectedPerfume?.brand} - {selectedPerfume?.name} Formülleri
                </DialogTitle>

              </div>
            </DialogHeader>

            <div className="flex gap-4 h-[600px]">
              {/* Sol Taraf - Parfüm Bilgileri ve Formül Listesi */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                {/* Parfüm Bilgileri Accordion */}
                {selectedPerfume && (
                  <div className="mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFavoriteToggle(selectedPerfume.id)}
                      className="flex items-center gap-2 mb-2 pl-0 hover:bg-transparent"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          selectedPerfume.is_favorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span className="text-sm">
                        {selectedPerfume.is_favorite ? "Favorilerden Çıkar" : "Favoriye Ekle"}
                      </span>
                    </Button>
                    <Accordion type="single" collapsible defaultValue="perfume-info">
                      <AccordionItem value="perfume-info">
                        <AccordionTrigger className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <span className="font-semibold text-base">Parfüm Bilgileri</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4">
                          <div className="space-y-3">
                            {/* Temel Bilgiler - 2 sütun */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Marka:</span>
                                <span className="ml-2 font-medium">{selectedPerfume.brand}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">İsim:</span>
                                <span className="ml-2 font-medium">{selectedPerfume.name}</span>
                              </div>
                              {(selectedPerfume as any).olfactive_family && (
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Koku Ailesi:</span>
                                  <span className="ml-2 font-medium">{(selectedPerfume as any).olfactive_family}</span>
                                </div>
                              )}
                              {(selectedPerfume as any).type && (
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Tip:</span>
                                  <span className="ml-2 font-medium">{(selectedPerfume as any).type}</span>
                                </div>
                              )}
                            </div>

                            {/* Piramit Notu */}
                            {(selectedPerfume as any).pyramid_note && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Piramit Notu:</span>
                                <span className="ml-2 font-medium">{(selectedPerfume as any).pyramid_note}</span>
                              </div>
                            )}
                            
                            {/* Notlar - 2 sütun */}
                            {creativeFormula && (
                              <div className="border-t pt-3 mt-2">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">Üst Notalar:</span>
                                    <div className="font-medium mt-1">{creativeFormula.top_notes}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">Orta Notalar:</span>
                                    <div className="font-medium mt-1">{creativeFormula.middle_notes}</div>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-500 dark:text-gray-400">Alt Notalar:</span>
                                    <div className="font-medium mt-1">{creativeFormula.base_notes}</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Önerilen Kullanım Oranı */}
                            {(selectedPerfume as any).recommended_usage && (
                              <div className="border-t pt-2 mt-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Önerilen Kullanım Oranı:</span>
                                <div className="font-medium mt-1">{(selectedPerfume as any).recommended_usage}</div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Formüller Grid */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg dark:text-gray-100">Kullanıcı Formülleri</h3>
                  <div className="space-y-3">
                    {formulas.map((formula, index) => (
                      <div
                        key={formula.id}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedFormulaId === formula.id && showComments
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs">
                              #{index + 1}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formula.created_at 
                                ? new Date(formula.created_at).toLocaleDateString("tr-TR")
                                : "Tarih belirtilmemiş"
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={formula.averageRating || 0}
                              readonly={true}
                              size="sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`flex items-center gap-1 ${
                                selectedFormulaId === formula.id && showComments
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                              onClick={(e: React.MouseEvent) => handleOpenComments(formula, e)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs">{formula.reviewCount || 0}</span>
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 h-7 w-7"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleDeleteFormula(formula.id, () => {
                                    if (selectedPerfume) fetchFormulas(selectedPerfume.id);
                                    fetchPerfumes();
                                  });
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Esans</div>
                            <div className="font-bold text-purple-700 dark:text-purple-300">
                              %{formula.fragrancePercentage}
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Alkol</div>
                            <div className="font-bold text-blue-700 dark:text-blue-300">
                              %{formula.alcoholPercentage}
                            </div>
                          </div>
                          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Su</div>
                            <div className="font-bold text-cyan-700 dark:text-cyan-300">
                              %{formula.waterPercentage}
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Dinlenme</div>
                            <div className="font-bold text-green-700 dark:text-green-300">
                              {formula.restDay} Gün
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - Yorumlar (+1 birim) */}
              {showComments && selectedFormulaId && (
                <div className="w-80 border-l pl-4 overflow-y-auto flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                  <FormulaComments
                    selectedFormula={formulas.find(f => f.id === selectedFormulaId)}
                    userId={user?.id}
                    isAdmin={isAdmin}
                    onRatingChange={handleRatingChange}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Other Dialogs */}
        <AddFormulaDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleFormulaSubmit}
          perfumes={perfumes}
          initialPerfume={selectedPerfume || undefined}
        />

        <PendingFormulasDialog
          open={isPendingDialogOpen}
          onOpenChange={setIsPendingDialogOpen}
          pendingRequests={pendingRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />

        <PerfumeGuideDialog
          open={isGuideOpen}
          onOpenChange={setIsGuideOpen}
        />

        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        />

        <RegisterDialog
          open={isRegisterOpen}
          onOpenChange={setIsRegisterOpen}
        />

        <LoginDialog
          open={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onLogin={handleLogin}
        />

        <PerfumeManagementDialog
          open={isPerfumeManagementOpen}
          onOpenChange={setIsPerfumeManagementOpen}
          onUpdate={fetchPerfumes}
        />

        <StockManagementDialog
          open={isStockManagementOpen}
          onOpenChange={setIsStockManagementOpen}
        />

        <FavoritesDialog
          open={isFavoritesOpen}
          onOpenChange={setIsFavoritesOpen}
          onFavoriteToggle={handleFavoriteToggle}
        />

        <FAQDialog open={isFAQOpen} onOpenChange={setIsFAQOpen} />
    </Layout>
  );
}

export default App;
//test