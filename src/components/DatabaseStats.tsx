
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Database, FileText, FilePlus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableStructureDialog } from "./TableStructureDialog";
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
  master_detail?: 'M' | 'D';
}

const DatabaseStats = ({ stats, connectionData }: { stats: TableStats[], connectionData: any }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [generatedForms, setGeneratedForms] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!stats?.length) return null;

  const handleFormAction = (tableName: string) => {
    if (generatedForms.has(tableName)) {
      // Lógica para editar formulario
      toast({
        title: "Editar Formulario",
        description: `Editando formulario para la tabla ${tableName}`,
      });
    } else {
      // Lógica para generar formulario
      setGeneratedForms(prev => new Set([...prev, tableName]));
      toast({
        title: "Generar Formulario",
        description: `Formulario generado para la tabla ${tableName}`,
      });
    }
  };

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
            <TableHead className="text-right">Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.table_name}>
              <TableCell className="font-medium">{stat.table_name}</TableCell>
              <TableCell className="text-right">{stat.row_count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{stat.size_in_kb.toFixed(2)}</TableCell>
              <TableCell className="text-right">{stat.master_detail === 'M' ? 'Maestro' : 'Detalle'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTable(stat.table_name)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  {stat.master_detail === 'M' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFormAction(stat.table_name)}
                    >
                      {generatedForms.has(stat.table_name) ? (
                        <Edit className="h-4 w-4" />
                      ) : (
                        <FilePlus className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TableStructureDialog
        open={!!selectedTable}
        onOpenChange={(open) => !open && setSelectedTable(null)}
        tableName={selectedTable || ''}
        connectionData={connectionData}
      />
    </Card>
  );
};

export default DatabaseStats;
