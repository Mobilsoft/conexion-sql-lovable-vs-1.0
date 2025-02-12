
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ClientesForm } from '@/components/ClientesForm';
import { ClientesTable } from '@/components/ClientesTable';
import { useState } from 'react';
import { Cliente } from '@/types/cliente';

const Clientes = () => {
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);

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
  };

  const handleDelete = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center p-4 border-b">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-semibold">Registro de Clientes</h1>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <ClientesForm 
                  onSave={handleSave} 
                  editingCliente={editingCliente} 
                />
                <ClientesTable 
                  clientes={clientes} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
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
