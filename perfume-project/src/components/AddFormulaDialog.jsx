// components/AddFormulaDialog.jsx
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Autocomplete from './Autocomplete'

const AddFormulaDialog = ({ open, onOpenChange, onSubmit, perfumes, initialPerfume }) => {
  const [formData, setFormData] = useState({
    perfume_id: '',
    fragrancePercentage: '0',
    alcoholPercentage: '0',
    waterPercentage: '0',
    restDay: ''
  })
  const [error, setError] = useState('')

  const handlePercentageChange = (field, value) => {
    // Değerin 0-100 arasında olduğundan emin oluyoruz
    const newValue = Math.min(100, Math.max(0, Number(value)))
    setFormData(prev => ({ ...prev, [field]: String(newValue) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Form validasyonları
    const fragrance = parseFloat(formData.fragrancePercentage)
    const alcohol = parseFloat(formData.alcoholPercentage)
    const water = parseFloat(formData.waterPercentage)

    if (!formData.perfume_id) {
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

    if ((fragrance + alcohol + water) != 100) {
      setError('Toplam yüzde 100 olmalı.')
      return
    }

    onSubmit(formData)
  }

  const handlePerfumeSelect = (perfume) => {
    setFormData(prev => ({ ...prev, perfume_id: perfume.id }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Formül Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Parfüm</Label>
            <Autocomplete onSelect={handlePerfumeSelect} />
          </div>

          {/* Esans Yüzdesi Progress Bar */}
          <div className="space-y-2">
            <Label htmlFor="fragrancePercentage">
              Esans Yüzdesi: {formData.fragrancePercentage}%
            </Label>
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={formData.fragrancePercentage}
                onChange={(e) => handlePercentageChange('fragrancePercentage', e.target.value)}
                className="relative w-full h-2 rounded-lg appearance-none cursor-pointer 
                  bg-gray-200 dark:bg-gray-700
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-purple-600
                  [&::-webkit-slider-thumb]:dark:bg-purple-400
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:relative
                  [&::-webkit-slider-thumb]:z-20
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-purple-600
                  [&::-moz-range-thumb]:dark:bg-purple-400
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:relative
                  [&::-moz-range-thumb]:z-20
                  transition-all duration-1200"
              />
              <div 
                className="absolute top-1 left-0 h-2 bg-purple-600/30 dark:bg-purple-400/30 rounded-lg transition-all duration-1200 z-10"
                style={{ width: `${formData.fragrancePercentage}%` }}
              />
            </div>
          </div>

          {/* Alkol Yüzdesi Progress Bar */}
          <div className="space-y-2">
            <Label htmlFor="alcoholPercentage">
              Alkol Yüzdesi: {formData.alcoholPercentage}%
            </Label>
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={formData.alcoholPercentage}
                onChange={(e) => handlePercentageChange('alcoholPercentage', e.target.value)}
                className="relative w-full h-2 rounded-lg appearance-none cursor-pointer 
                  bg-gray-200 dark:bg-gray-700
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-600
                  [&::-webkit-slider-thumb]:dark:bg-blue-400
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:relative
                  [&::-webkit-slider-thumb]:z-20
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-blue-600
                  [&::-moz-range-thumb]:dark:bg-blue-400
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:relative
                  [&::-moz-range-thumb]:z-20
                  transition-all duration-1200"
              />
              <div 
                className="absolute top-1 left-0 h-2 bg-blue-600/30 dark:bg-blue-400/30 rounded-lg transition-all duration-1200 z-10"
                style={{ width: `${formData.alcoholPercentage}%` }}
              />
            </div>
          </div>

          {/* Su Yüzdesi Progress Bar */}
          <div className="space-y-2">
            <Label htmlFor="waterPercentage">
              Su Yüzdesi: {formData.waterPercentage}%
            </Label>
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={formData.waterPercentage}
                onChange={(e) => handlePercentageChange('waterPercentage', e.target.value)}
                className="relative w-full h-2 rounded-lg appearance-none cursor-pointer 
                  bg-gray-200 dark:bg-gray-700
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-cyan-600
                  [&::-webkit-slider-thumb]:dark:bg-cyan-400
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:relative
                  [&::-webkit-slider-thumb]:z-20
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-cyan-600
                  [&::-moz-range-thumb]:dark:bg-cyan-400
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:relative
                  [&::-moz-range-thumb]:z-20
                  transition-all duration-1200"
              />
              <div 
                className="absolute top-1 left-0 h-2 bg-cyan-600/30 dark:bg-cyan-400/30 rounded-lg transition-all duration-1200 z-10"
                style={{ width: `${formData.waterPercentage}%` }}
              />
            </div>
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

          {/* Toplam Yüzde Göstergesi */}
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium dark:text-gray-300">Toplam:</span>
              <span className={`text-sm font-bold ${
                parseFloat(formData.fragrancePercentage) + 
                parseFloat(formData.alcoholPercentage) + 
                parseFloat(formData.waterPercentage) > 100 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-green-500 dark:text-green-400'
              }`}>
                {(parseFloat(formData.fragrancePercentage) + 
                  parseFloat(formData.alcoholPercentage) + 
                  parseFloat(formData.waterPercentage)).toFixed(2)}%
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
          )}

          <Button variant="default" type="submit" className="w-full">
            Kaydet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFormulaDialog