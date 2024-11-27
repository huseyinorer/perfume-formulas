// src/components/PendingFormulasDialog.jsx
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

const PendingFormulasDialog = ({ open, onClose, requests = [], onApprove, onReject }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-4xl bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-bold mb-4">
            Bekleyen Formül İstekleri
          </Dialog.Title>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parfüm</TableHead>
                  <TableHead>Esans %</TableHead>
                  <TableHead>Alkol %</TableHead>
                  <TableHead>Su %</TableHead>
                  <TableHead>Dinlenme (Gün)</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.brandName} - {request.parfumeName}</TableCell>
                    <TableCell>{request.fragrancePercentage}%</TableCell>
                    <TableCell>{request.alcoholPercentage}%</TableCell>
                    <TableCell>{request.waterPercentage}%</TableCell>
                    <TableCell>{request.restDay}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(request.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => onReject(request.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Reddet
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Bekleyen formül isteği bulunmuyor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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