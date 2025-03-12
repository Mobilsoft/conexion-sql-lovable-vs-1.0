
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import SqlConnectionForm from '@/components/SqlConnectionForm';
import { Separator } from '@/components/ui/separator';

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
            <div className="w-full text-center mt-2">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Estadísticas de la Base de Datos</h2>
              <Separator className="mt-2 mb-4 mx-auto w-1/2" />
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
