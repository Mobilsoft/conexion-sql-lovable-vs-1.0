
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ClientesForm } from '@/components/ClientesForm';
import { ClientesTable } from '@/components/ClientesTable';
import { useState } from 'react';
import { Cliente } from '@/types/cliente';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Clientes = () => {
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);

  const handleSave = (cliente: Cliente) => {
    if (editingCliente) {
      setClientes(clientes.map(c => c.id === cliente.id ? cliente : c));
    } else {
      setClientes([...clientes, { ...cliente, id: Date.now() }]);
    }
    setEditingCliente(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
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
