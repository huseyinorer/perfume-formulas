import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import StarRating from "./ui/starRating";
import { MessageCircle, Edit, Trash2, Send, FlaskConical } from "lucide-react";

const FormulaComments = ({
  selectedFormula,
  userId,
  isAdmin,
  onRatingChange,
  isLoggedIn = false,
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [userHasComment, setUserHasComment] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // selectedFormula.id değiştiğinde verileri yeniden yükle
  useEffect(() => {
    fetchComments();
    fetchUserRating();
  }, [selectedFormula.id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/formulas/${selectedFormula.id}/ratings`
      );

      if (!response.ok) {
        throw new Error("Yorumlar yüklenirken bir hata oluştu.");
      }

      const data = await response.json();
      setComments(data);

      // Kullanıcının yorum yapıp yapmadığını kontrol et
      const hasUserComment = data.some((comment) => comment.user_id === userId);
      setUserHasComment(hasUserComment);

      // Değerlendirme sayısı ve ortalama puanı hesapla ve yukarı gönder
      calculateRatingStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateRatingStats = (commentsData) => {
    if (!commentsData || commentsData.length === 0) {
      // Değerlendirme yoksa parent komponente bildir
      if (onRatingChange) {
        onRatingChange(0, 0);
      }
      return;
    }

    const reviewCount = commentsData.length;
    const totalRating = commentsData.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    const averageRating = totalRating / reviewCount;

    // Parent komponente bildir
    if (onRatingChange) {
      onRatingChange(averageRating, reviewCount);
    }
  };

  const fetchUserRating = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/formulas/${selectedFormula.id}/user-rating`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Kullanıcı henüz yorum yapmamış
        setUserRating(0);
        setNewComment("");
        setUserHasComment(false);
        return;
      }

      const data = await response.json();
      if (data) {
        setUserRating(data.rating || 0);
        setNewComment(data.comment || "");
        setUserHasComment(true);
      } else {
        // Kullanıcı henüz yorum yapmamış
        setUserRating(0);
        setNewComment("");
        setUserHasComment(false);
      }
    } catch (err) {
      console.error("Error fetching user rating:", err);
      // Hata durumunda formu temizle
      setUserRating(0);
      setNewComment("");
      setUserHasComment(false);
    }
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleSubmitComment = async () => {
    if (userRating === 0) {
      alert("Lütfen bir puan seçin");
      return;
    }

    if (!newComment.trim()) {
      alert("Lütfen bir yorum yazın");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Oturum süresi dolmuş. Lütfen yeniden giriş yapın.");
        return;
      }

      const response = await fetch(
        `${API_URL}/formulas/${selectedFormula.id}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: userRating,
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Yorum gönderilirken bir hata oluştu.");
      }

      const result = await response.json();

      // Kullanıcı artık yorum yapmış
      setUserHasComment(true);

      // Yorumları yeniden yükle
      await fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Oturum süresi dolmuş. Lütfen yeniden giriş yapın.");
        return;
      }

      const response = await fetch(
        `${API_URL}/formulas/ratings/${editingCommentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: editText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Yorum güncellenirken bir hata oluştu.");
      }

      // State'i güncelle
      setComments(
        comments.map((comment) =>
          comment.id === editingCommentId
            ? {
                ...comment,
                comment: editText,
                updated_at: new Date().toISOString(),
              }
            : comment
        )
      );

      // Kullanıcının kendi yorumuysa, form alanını da güncelle
      const editedComment = comments.find((c) => c.id === editingCommentId);
      if (editedComment && editedComment.user_id === userId) {
        setNewComment(editText);
      }

      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Oturum süresi dolmuş. Lütfen yeniden giriş yapın.");
        return;
      }

      const response = await fetch(`${API_URL}/formulas/ratings/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Yorum silinirken bir hata oluştu.");
      }

      // Eğer kullanıcı kendi yorumunu sildiyse, yorum formunu sıfırla
      const deletedComment = comments.find(
        (comment) => comment.id === commentId
      );
      if (deletedComment && deletedComment.user_id === userId) {
        setUserRating(0);
        setNewComment("");
        setUserHasComment(false);
      }

      // State'i güncelle
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);

      // Değerlendirme istatistiklerini güncelle
      calculateRatingStats(updatedComments);
    } catch (err) {
      setError(err.message);
    }
  };

  const canEdit = (comment) => {
    return comment.user_id === userId || isAdmin;
  };

  // Yıldız seçme arayüzü komponenti
  const RatingSelector = () => (
    <div className="flex flex-col items-center mb-4">
      <p className="text-sm text-gray-500 mb-2">Puanınızı seçin:</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`p-1 rounded-full transition-all ${
              userRating >= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
            onClick={() => handleRatingClick(rating)}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  // Date-fns kullanmadan tarih formatı
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return "az önce";
    } else if (diffMin < 60) {
      return `${diffMin} dakika önce`;
    } else if (diffHour < 24) {
      return `${diffHour} saat önce`;
    } else if (diffDay < 30) {
      return `${diffDay} gün önce`;
    } else {
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Değerlendirmeler ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz değerlendirme yapılmamış. İlk değerlendirmeyi siz yapın!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{comment.username}</div>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={comment.rating}
                        showCount={false}
                        size="small"
                      />
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  {canEdit(comment) && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditComment(comment)}
                        title="Düzenle"
                      >
                        <Edit className="h-3.5 w-3.5 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Sil"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment.id ? (
                  <div>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[80px] mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCommentId(null)}
                      >
                        İptal
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        Kaydet
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {comment.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-2 rounded-lg">
        <div className="border-t pt-3">
          {!isLoggedIn ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Değerlendirme yapabilmek için giriş yapmanız gerekmektedir.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Yorumları okuyabilir ancak yorum yapamazsınız.
              </p>
            </div>
          ) : userHasComment ? (
            <div className="text-center text-sm text-gray-500 mb-4">
              Bu formülü zaten değerlendirdiniz. Değerlendirmenizi silip yeniden
              değerlendirme yapabilirsiniz.
            </div>
          ) : (
            <>
            <div className="flex justify-between items-center border-b pb-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FlaskConical  className="h-5 w-5 text-green-500" />
            Değerlendirilen Formül
          </h3>
          <div className="mt-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
            <div className="flex gap-4">
              <div>
                <span className="font-medium">Eklenme Tarihi:</span> 
                {selectedFormula?.created_at ? 
                  new Date(selectedFormula.created_at).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '.') 
                  : ''}
              </div>
              <div>
                <span className="font-medium">Esans:</span> %
                {selectedFormula?.fragrancePercentage}
              </div>
              <div>
                <span className="font-medium">Alkol:</span> %
                {selectedFormula?.alcoholPercentage}
              </div>
              <div>
                <span className="font-medium">Su:</span> %
                {selectedFormula?.waterPercentage}
              </div>
              <div>
                <span className="font-medium">Dinlenme:</span>{" "}
                {selectedFormula?.restDay} gün
              </div>
            </div>
          </div>
        </div>
      </div>
              <RatingSelector />
              <div className="relative">
                <Textarea
                  value={newComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setNewComment(e.target.value);
                    }
                  }}
                  placeholder="Değerlendirmenizi yazın... (Maksimum 1000 karakter)"
                  className="min-h-[80px] max-h-[200px] resize-none w-full pr-4 overflow-y-auto"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {newComment.length}/1000 karakter
                  </div>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={
                      submitting || userRating === 0 || !newComment.trim()
                    }
                    className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    size="sm"
                  >
                    {submitting ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-white dark:text-blue-500" />
                        <span>Değerlendir</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaComments;

