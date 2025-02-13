
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

const DatabaseStats = ({ stats }: { stats: TableStats[] }) => {
  if (!stats?.length) return null;

  return (
    <Card className="w-full max-w-2xl p-6 mt-8 bg-white/90 dark:bg-slate-900/90 border-0 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Estadísticas de la Base de Datos
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tabla</TableHead>
            <TableHead className="text-right">Registros</TableHead>
            <TableHead className="text-right">Tamaño (KB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.table_name}>
              <TableCell className="font-medium">{stat.table_name}</TableCell>
              <TableCell className="text-right">{stat.row_count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{stat.size_in_kb.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DatabaseStats;
