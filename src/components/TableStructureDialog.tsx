
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

interface TableStructure {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
  max_length: number;
  precision: number;
  scale: number;
}

interface TableStructureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: string;
  connectionData: any;
}

export function TableStructureDialog({ 
  open, 
  onOpenChange, 
  tableName,
  connectionData 
}: TableStructureDialogProps) {
  const { data: structure, isLoading } = useQuery({
    queryKey: ['tableStructure', tableName],
    queryFn: async () => {
      const { data: response, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'getTableStructure',
          data: {
            ...connectionData,
            tableName
          }
        }
      })

      if (error) throw error
      return response.data as TableStructure[]
    },
    enabled: open
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Estructura de la tabla: {tableName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Columna</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nullable</TableHead>
                <TableHead>Valor por defecto</TableHead>
                <TableHead>Longitud/Precisión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {structure?.map((col) => (
                <TableRow key={col.column_name}>
                  <TableCell className="font-medium">{col.column_name}</TableCell>
                  <TableCell>{col.data_type}</TableCell>
                  <TableCell>{col.is_nullable ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{col.column_default || '-'}</TableCell>
                  <TableCell>
                    {col.max_length > 0 ? col.max_length : 
                     col.precision > 0 ? `${col.precision},${col.scale}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
