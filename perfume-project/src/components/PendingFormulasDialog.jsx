// src/components/PendingFormulasDialog.jsx
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

const PendingFormulasDialog = ({ open, onClose, requests = [], onApprove, onReject }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
          w-[90vw] max-w-4xl bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg 
          border dark:border-gray-700 z-50">
          <Dialog.Title className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
            Bekleyen Formül İstekleri
          </Dialog.Title>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Parfüm</TableHead>
                  <TableHead className="dark:text-gray-300">Esans %</TableHead>
                  <TableHead className="dark:text-gray-300">Alkol %</TableHead>
                  <TableHead className="dark:text-gray-300">Su %</TableHead>
                  <TableHead className="dark:text-gray-300">Dinlenme (Gün)</TableHead>
                  <TableHead className="dark:text-gray-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="dark:border-gray-700">
                    <TableCell className="dark:text-gray-300">{request.brand} - {request.parfumeName}</TableCell>
                    <TableCell className="dark:text-gray-300">{request.fragrancePercentage}%</TableCell>
                    <TableCell className="dark:text-gray-300">{request.alcoholPercentage}%</TableCell>
                    <TableCell className="dark:text-gray-300">{request.waterPercentage}%</TableCell>
                    <TableCell className="dark:text-gray-300">{request.restDay}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(request.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 
                            transition-all duration-1200 transform hover:-translate-y-0.5"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => onReject(request.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 
                            transition-all duration-1200 transform hover:-translate-y-0.5"
                        >
                          Reddet
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow className="dark:border-gray-700">
                    <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
                      Bekleyen formül isteği bulunmuyor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                dark:text-gray-500 dark:hover:text-gray-300
                transition-all duration-1200"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PendingFormulasDialog