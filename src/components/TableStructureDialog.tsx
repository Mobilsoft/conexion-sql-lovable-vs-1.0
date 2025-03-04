
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
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

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
    queryKey: ['tableStructure', tableName, connectionData],
    queryFn: async () => {
      console.log("Fetching structure for table:", tableName);
      
      if (!tableName) {
        return [];
      }
      
      // In development mode with localhost, use mock data
      if (import.meta.env.DEV && connectionData.server === "localhost") {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock structures available in the code
        return mockStructures[tableName] || [];
      } else {
        // Call the edge function to get the real structure
        const { data: result, error } = await supabase.functions.invoke(
          'sql-server-connection/structure', 
          {
            body: JSON.stringify({
              ...connectionData,
              tableName
            }),
            method: 'POST',
          }
        );

        if (error) {
          console.error("Error fetching table structure:", error);
          throw new Error(error.message);
        }
        
        if (!result.success) {
          console.error("Structure fetch failed:", result.error);
          throw new Error(result.error);
        }
        
        console.log("Received structure data:", result.data);
        return result.data.recordset || [];
      }
    },
    enabled: open && !!tableName
  });

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
  );
}

// Mock data for local development
const mockStructures: Record<string, TableStructure[]> = {
  "cio_customers": [
    { column_name: "id", data_type: "integer", is_nullable: false, column_default: "nextval('cio_customers_id_seq'::regclass)", max_length: 0, precision: 0, scale: 0 },
    { column_name: "nombre", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "apellido", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "id_tipo_documento", data_type: "integer", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "numero_documento", data_type: "character varying", is_nullable: false, column_default: null, max_length: 20, precision: 0, scale: 0 },
    { column_name: "razon_social", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "email", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "telefono", data_type: "character varying", is_nullable: false, column_default: null, max_length: 20, precision: 0, scale: 0 },
    { column_name: "direccion", data_type: "text", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "id_ciudad", data_type: "integer", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "estado", data_type: "boolean", is_nullable: true, column_default: "true", max_length: 0, precision: 0, scale: 0 },
    { column_name: "master_detail", data_type: "character", is_nullable: true, column_default: "'M'::bpchar", max_length: 1, precision: 0, scale: 0 },
    { column_name: "fecha_creacion", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 },
    { column_name: "fecha_actualizacion", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 }
  ],
  "cio_products": [
    { column_name: "id", data_type: "integer", is_nullable: false, column_default: "nextval('cio_products_id_seq'::regclass)", max_length: 0, precision: 0, scale: 0 },
    { column_name: "nombre", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "codigo", data_type: "character varying", is_nullable: false, column_default: null, max_length: 50, precision: 0, scale: 0 },
    { column_name: "descripcion", data_type: "text", is_nullable: true, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "precio_compra", data_type: "numeric", is_nullable: false, column_default: null, max_length: 0, precision: 10, scale: 2 },
    { column_name: "precio_venta", data_type: "numeric", is_nullable: false, column_default: null, max_length: 0, precision: 10, scale: 2 },
    { column_name: "id_categoria", data_type: "integer", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "id_marca", data_type: "integer", is_nullable: true, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "stock_actual", data_type: "integer", is_nullable: true, column_default: "0", max_length: 0, precision: 0, scale: 0 },
    { column_name: "stock_minimo", data_type: "integer", is_nullable: true, column_default: "0", max_length: 0, precision: 0, scale: 0 },
    { column_name: "stock_maximo", data_type: "integer", is_nullable: true, column_default: "0", max_length: 0, precision: 0, scale: 0 },
    { column_name: "estado", data_type: "boolean", is_nullable: true, column_default: "true", max_length: 0, precision: 0, scale: 0 },
    { column_name: "master_detail", data_type: "character", is_nullable: true, column_default: "'M'::bpchar", max_length: 1, precision: 0, scale: 0 },
    { column_name: "fecha_creacion", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 },
    { column_name: "fecha_actualizacion", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 }
  ],
  "gen_empresas": [
    { column_name: "id", data_type: "integer", is_nullable: false, column_default: "nextval('gen_empresas_id_seq'::regclass)", max_length: 0, precision: 0, scale: 0 },
    { column_name: "nit", data_type: "character varying", is_nullable: false, column_default: null, max_length: 20, precision: 0, scale: 0 },
    { column_name: "dv", data_type: "character varying", is_nullable: false, column_default: null, max_length: 1, precision: 0, scale: 0 },
    { column_name: "razon_social", data_type: "text", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "tipo_contribuyente", data_type: "character varying", is_nullable: false, column_default: null, max_length: 50, precision: 0, scale: 0 },
    { column_name: "direccion", data_type: "text", is_nullable: false, column_default: null, max_length: 0, precision: 0, scale: 0 },
    { column_name: "telefono", data_type: "character varying", is_nullable: false, column_default: null, max_length: 20, precision: 0, scale: 0 },
    { column_name: "email", data_type: "character varying", is_nullable: false, column_default: null, max_length: 255, precision: 0, scale: 0 },
    { column_name: "municipio", data_type: "character varying", is_nullable: false, column_default: null, max_length: 100, precision: 0, scale: 0 },
    { column_name: "estado_empresa", data_type: "character varying", is_nullable: true, column_default: "'Activo'::character varying", max_length: 20, precision: 0, scale: 0 },
    { column_name: "tabla_master", data_type: "character", is_nullable: true, column_default: "'D'::bpchar", max_length: 1, precision: 0, scale: 0 },
    { column_name: "created_at", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 },
    { column_name: "updated_at", data_type: "timestamp with time zone", is_nullable: true, column_default: "CURRENT_TIMESTAMP", max_length: 0, precision: 0, scale: 0 }
  ]
};
