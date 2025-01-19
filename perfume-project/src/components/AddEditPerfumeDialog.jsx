import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const AddEditPerfumeDialog = ({ open, onOpenChange, perfume, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brand_id: '',
    perfume_name: '',
    type: '',
    pyramid_note: '',
    top_notes: '',
    middle_notes: '',
    base_notes: '',
    olfactive_family: ''
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (perfume) {
      setFormData({
        brand_id: perfume.brand_id,
        perfume_name: perfume.perfume_name,
        type: perfume.type || '',
        pyramid_note: perfume.pyramid_note || '',
        top_notes: perfume.top_notes || '',
        middle_notes: perfume.middle_notes || '',
        base_notes: perfume.base_notes || '',
        olfactive_family: perfume.olfactive_family || ''
      });
    } else {
      setFormData({
        brand_id: '',
        perfume_name: '',
        type: '',
        pyramid_note: '',
        top_notes: '',
        middle_notes: '',
        base_notes: '',
        olfactive_family: ''
      });
    }
    setCurrentStep(1);
  }, [perfume]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/brands`);
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      alert('Markalar yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    try {
      const url = perfume 
        ? `${import.meta.env.VITE_API_URL}/perfumes/${perfume.id}`
        : `${import.meta.env.VITE_API_URL}/perfumes`;
      
      const response = await fetch(url, {
        method: perfume ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {perfume ? 'Parfüm Düzenle' : 'Yeni Parfüm Ekle'} - Adım {currentStep}/2
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 ? (
            // Adım 1: Temel Bilgiler
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand_id">Marka</Label>
                  <Select
                    value={formData.brand_id ? formData.brand_id.toString() : ''}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      brand_id: value ? parseInt(value) : null 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Marka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.brand_id} value={brand.brand_id.toString()}>
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfume_name">Parfüm Adı</Label>
                  <Input
                    id="perfume_name"
                    value={formData.perfume_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, perfume_name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tür</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="olfactive_family">Koku Ailesi</Label>
                  <Input
                    id="olfactive_family"
                    value={formData.olfactive_family}
                    onChange={(e) => setFormData(prev => ({ ...prev, olfactive_family: e.target.value }))}
                  />
                </div>
              </div>
            </>
          ) : (
            // Adım 2: Notalar
            <>
              <div className="space-y-2">
                <Label htmlFor="pyramid_note">Piramit Notu</Label>
                <Textarea
                  id="pyramid_note"
                  value={formData.pyramid_note}
                  onChange={(e) => setFormData(prev => ({ ...prev, pyramid_note: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="top_notes">Üst Notalar</Label>
                <Textarea
                  id="top_notes"
                  value={formData.top_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, top_notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_notes">Orta Notalar</Label>
                <Textarea
                  id="middle_notes"
                  value={formData.middle_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, middle_notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_notes">Alt Notalar</Label>
                <Textarea
                  id="base_notes"
                  value={formData.base_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}
          
          <div className="flex justify-between mt-6">
            {currentStep === 2 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Geri
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              {currentStep === 1 ? (
                <>
                  İleri
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                perfume ? 'Güncelle' : 'Ekle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPerfumeDialog; 