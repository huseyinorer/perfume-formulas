import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PerfumeTable = ({ perfumes, onRowClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Marka</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Formül Sayısı</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {perfumes.map((perfume) => (
          <TableRow
            key={perfume.id}
            onClick={() => onRowClick(perfume)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <TableCell>{perfume.brandName}</TableCell>
            <TableCell>{perfume.name}</TableCell>
            <TableCell>{perfume.formulaCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PerfumeTable;