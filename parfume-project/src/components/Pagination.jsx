// src/components/Pagination.jsx
import React from 'react'
import { Button } from './ui/button'
import { Select } from './ui/select'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  pageSize, 
  onPageSizeChange, 
  totalItems 
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          Gösterilen: {Math.min(pageSize * currentPage, totalItems)} / {totalItems}
        </span>
        <select
          className="border rounded-md p-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          İlk
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Önceki
        </Button>
        <span className="px-4 py-2">
          Sayfa {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Son
        </Button>
      </div>
    </div>
  )
}

export default Pagination