
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ClientesForm } from '@/components/ClientesForm';
import { ClientesTable } from '@/components/ClientesTable';
import { useState } from 'react';
import { Cliente } from '@/types/cliente';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

const Clientes = () => {
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/clientes');
      if (!response.ok) {
        throw new Error('Error al cargar clientes');
      }
      return response.json();
    },
  });

  const handleSave = async (cliente: Cliente) => {
    try {
      if (editingCliente) {
        const response = await fetch(`http://localhost:3000/clientes/${cliente.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cliente),
        });

        if (!response.ok) throw new Error('Error al actualizar cliente');

        toast({
          title: "Cliente actualizado",
          description: "Los datos del cliente han sido actualizados exitosamente.",
        });
      } else {
        const response = await fetch('http://localhost:3000/clientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cliente),
        });

        if (!response.ok) throw new Error('Error al crear cliente');

        toast({
          title: "Cliente registrado",
          description: "El cliente ha sido registrado exitosamente.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setEditingCliente(null);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar cliente');

      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingCliente(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="ml-4 text-xl font-semibold">Registro de Clientes</h1>
              </div>
              <Button onClick={() => setOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <ClientesTable 
                  clientes={clientes} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
                <ClientesForm 
                  open={open}
                  onOpenChange={handleOpenChange}
                  onSave={handleSave} 
                  editingCliente={editingCliente} 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Clientes;
