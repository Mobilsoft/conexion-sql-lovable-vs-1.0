
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import SqlConnectionForm from '@/components/SqlConnectionForm';

const DiccionarioDatos = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center p-4 border-b">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-semibold">Diccionario de Datos</h1>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <SqlConnectionForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DiccionarioDatos;
