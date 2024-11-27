// src/components/ui/table.jsx
const Table = ({ children, className = "", ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
)

const TableHeader = ({ children, className = "", ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
)

const TableBody = ({ children, className = "", ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
    {children}
  </tbody>
)

const TableCell = ({ children, className = "", ...props }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </td>
)

const TableRow = ({ children, className = "", ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 ${className}`}
    {...props}
  >
    {children}
  </tr>
)

const TableHead = ({ children, className = "", ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </th>
)

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead }