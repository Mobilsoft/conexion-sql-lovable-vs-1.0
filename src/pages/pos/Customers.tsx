
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { CustomerDialog } from '@/components/pos/customers/CustomerDialog';

interface Customer {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: { nombre: string };
  numero_documento: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: boolean;
}

const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cio_customers')
        .select(`
          *,
          tipo_documento:id_tipo_documento(nombre)
        `)
        .order('nombre');

      if (error) throw error;
      return data as Customer[];
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Button onClick={() => {
          setSelectedCustomer(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Cargando clientes...
                </TableCell>
              </TableRow>
            ) : customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{`${customer.nombre} ${customer.apellido}`}</TableCell>
                <TableCell>{`${customer.tipo_documento.nombre} ${customer.numero_documento}`}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.telefono}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersPage;
