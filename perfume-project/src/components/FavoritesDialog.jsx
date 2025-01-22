import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Pagination from "./Pagination";

const FavoritesDialog = ({ open, onOpenChange, onFavoriteToggle }) => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (open) {
      fetchFavorites();
    }
  }, [open, currentPage, pageSize]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/favorites?page=${currentPage}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setFavorites(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Favorilerim</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marka</TableHead>
              <TableHead>Parfüm Adı</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favorites.map((perfume) => (
              <TableRow key={perfume.perfume_id}>
                <TableCell>{perfume.brand}</TableCell>
                <TableCell>{perfume.name}</TableCell>
                <TableCell>{perfume.type}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={async () => {
                      await onFavoriteToggle(perfume.perfume_id);
                      setFavorites((prevFavorites) =>
                        prevFavorites.filter(
                          (fav) => fav.perfume_id !== perfume.perfume_id
                        )
                      );
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                  </button>
                </TableCell>
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
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesDialog;
