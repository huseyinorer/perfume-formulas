import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import AddEditPerfumeDialog from "./AddEditPerfumeDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Pagination from "./Pagination";

const PerfumeManagementDialog = ({ open, onOpenChange }) => {
  const [perfumes, setPerfumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (open) {
      fetchPerfumes();
    }
  }, [currentPage, pageSize, debouncedSearchTerm, open]);

  const fetchPerfumes = async () => {
    try {
      console.log('Fetching perfumes...'); // Debug log
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      console.log('Fetched perfumes data:', data); // Debug log
      setPerfumes(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Bu parfümü silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/perfumes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchPerfumes();
        } else {
          alert('Parfüm silinirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Error deleting perfume:', error);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Parfüm Yönetimi</DialogTitle>
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
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Parfüm Ekle
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Marka</TableHead>
                  <TableHead className="dark:text-gray-300">Parfüm Adı</TableHead>
                  <TableHead className="text-right dark:text-gray-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(perfumes) && perfumes.map((perfume) => (
                  <TableRow key={perfume.id} className="dark:border-gray-700">
                    <TableCell className="font-medium dark:text-gray-300">{perfume.brand}</TableCell>
                    <TableCell className="dark:text-gray-300">{perfume.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPerfume({
                            id: perfume.id,
                            brand_id: perfume.brand_id,
                            perfume_name: perfume.name,
                            type: perfume.type || '',
                            pyramid_note: perfume.pyramid_note || '',
                            top_notes: perfume.top_notes || '',
                            middle_notes: perfume.middle_notes || '',
                            base_notes: perfume.base_notes || '',
                            olfactive_family: perfume.olfactive_family || ''
                          });
                          setIsEditDialogOpen(true);
                        }}
                        className="bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50 mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(perfume.id, e)}
                        className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Toplam {totalItems} parfüm
              </div>
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
        </DialogContent>
      </Dialog>

      <AddEditPerfumeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchPerfumes}
      />

      <AddEditPerfumeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        perfume={selectedPerfume}
        onSuccess={fetchPerfumes}
      />
    </>
  );
};

export default PerfumeManagementDialog; 