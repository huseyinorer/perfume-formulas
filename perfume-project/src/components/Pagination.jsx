// src/components/Pagination.jsx
import React from 'react'
import { Button } from './ui/button'

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
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Gösterilen: {Math.min(pageSize * currentPage, totalItems)} / {totalItems}
        </span>
        <select
          className="border rounded-md p-1 bg-white dark:bg-gray-800 dark:border-gray-700 
                     dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
        <span className="px-4 py-2 dark:text-gray-300">
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