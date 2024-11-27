// components/AddFormulaDialog.jsx
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const AddFormulaDialog = ({ open, onClose, onSave, perfumes }) => {
  const [formData, setFormData] = useState({
    parfumesId: '',
    fragrancePercentage: '',
    alcoholPercentage: '',
    waterPercentage: '',
    restDay: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Form validasyonları
    const fragrance = parseFloat(formData.fragrancePercentage)
    const alcohol = parseFloat(formData.alcoholPercentage)
    const water = parseFloat(formData.waterPercentage)

    if (!formData.parfumesId) {
      setError('Lütfen bir parfüm seçin.')
      return
    }

    if (fragrance <= 0 || alcohol <= 0) {
      setError('Esans ve alkol yüzdesi 0\'dan büyük olmalıdır.')
      return
    }

    if (water < 0) {
      setError('Su yüzdesi 0\'dan küçük olamaz.')
      return
    }

    if (fragrance + alcohol + water > 100) {
      setError('Toplam yüzde 100\'ü geçemez.')
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Formül Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parfume">Parfüm</Label>
            <select
              id="parfume"
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={formData.parfumesId}
              onChange={(e) => setFormData({ ...formData, parfumesId: e.target.value })}
            >
              <option value="">Parfüm seçin</option>
              {perfumes.map((perfume) => (
                <option key={perfume.id} value={perfume.id.toString()}>
                  {perfume.brandName} - {perfume.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fragrancePercentage">Esans Yüzdesi (%)</Label>
            <Input
              id="fragrancePercentage"
              type="number"
              step="0.01"
              value={formData.fragrancePercentage}
              onChange={(e) => setFormData({ ...formData, fragrancePercentage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alcoholPercentage">Alkol Yüzdesi (%)</Label>
            <Input
              id="alcoholPercentage"
              type="number"
              step="0.01"
              value={formData.alcoholPercentage}
              onChange={(e) => setFormData({ ...formData, alcoholPercentage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterPercentage">Su Yüzdesi (%)</Label>
            <Input
              id="waterPercentage"
              type="number"
              step="0.01"
              value={formData.waterPercentage}
              onChange={(e) => setFormData({ ...formData, waterPercentage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restDay">Dinlenme Süresi (Gün)</Label>
            <Input
              id="restDay"
              type="number"
              value={formData.restDay}
              onChange={(e) => setFormData({ ...formData, restDay: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Kaydet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFormulaDialog