
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, FormInput } from "lucide-react";
import { TableStats } from "@/types/database-stats";

interface DatabaseStatsTableProps {
  stats: TableStats[];
  onViewStructure: (tableName: string) => void;
  onOpenForm: (tableName: string) => void;
}

export const DatabaseStatsTable: React.FC<DatabaseStatsTableProps> = ({
  stats,
  onViewStructure,
  onOpenForm,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="h-8">
          <TableHead>Tabla</TableHead>
          <TableHead className="text-right">Registros</TableHead>
          <TableHead className="text-right">Tamaño (KB)</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(stats || []).map((stat) => (
          <TableRow key={stat.table_name} className="h-8">
            <TableCell className="font-medium py-1">{stat.table_name}</TableCell>
            <TableCell className="text-right py-1">{stat.row_count.toLocaleString()}</TableCell>
            <TableCell className="text-right py-1">{stat.size_in_kb.toFixed(2)}</TableCell>
            <TableCell className="text-right space-x-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewStructure(stat.table_name)}
                className="h-7 w-7"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenForm(stat.table_name)}
                className="h-7 w-7"
              >
                <FormInput className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
