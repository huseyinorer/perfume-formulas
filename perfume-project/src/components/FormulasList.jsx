import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { query } from '../db/db';

const FormulasList = ({ open, onClose, perfume }) => {
  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    if (perfume) {
      fetchFormulas();
    }
  }, [perfume]);

  const fetchFormulas = async () => {
    try {
      const result = await query(
        `SELECT * FROM "ParfumensFormules" WHERE "parfumesId" = $1 ORDER BY id DESC`,
        [perfume.id]
      );
      setFormulas(result.rows);
    } catch (error) {
      console.error('Error fetching formulas:', error);
    }
  };

  if (!perfume) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {perfume.brand} - {perfume.name} Formülleri
          </DialogTitle>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Esans %</TableHead>
              <TableHead>Alkol %</TableHead>
              <TableHead>Su %</TableHead>
              <TableHead>Dinlenme (Gün)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formulas.map((formula) => (
              <TableRow key={formula.id}>
                <TableCell>{formula.fragrancePercentage}%</TableCell>
                <TableCell>{formula.alcoholPercentage}%</TableCell>
                <TableCell>{formula.waterPercentage}%</TableCell>
                <TableCell>{formula.restDay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default FormulasList;