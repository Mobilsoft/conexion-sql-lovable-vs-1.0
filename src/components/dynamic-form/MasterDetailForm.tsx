
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DynamicForm } from "../DynamicForm";
import { Plus } from "lucide-react";

interface MasterDetailFormProps {
  masterTitle: string;
  detailTitle: string;
  masterFields: any[];
  detailFields: any[];
  onMasterSave: (data: any) => void;
  onDetailSave: (data: any) => void;
}

export function MasterDetailForm({
  masterTitle,
  detailTitle,
  masterFields,
  detailFields,
  onMasterSave,
  onDetailSave
}: MasterDetailFormProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [masterData, setMasterData] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);

  const handleMasterSave = (data: any) => {
    setMasterData(data);
    onMasterSave(data);
  };

  const handleDetailSave = (data: any) => {
    setDetails([...details, data]);
    onDetailSave(data);
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Formulario Maestro */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{masterTitle}</h2>
        <DynamicForm
          open={true}
          onOpenChange={() => {}}
          fields={masterFields}
          tableName={masterTitle}
          onSave={handleMasterSave}
        />
      </div>

      {/* Detalles */}
      {masterData && (
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{detailTitle}</h2>
            <Button onClick={() => setIsDetailOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar {detailTitle}
            </Button>
          </div>

          {/* Lista de detalles */}
          <div className="space-y-4">
            {details.map((detail, index) => (
              <div key={index} className="border p-4 rounded-md">
                {Object.entries(detail).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Modal de detalle */}
          <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Nuevo {detailTitle}</SheetTitle>
                <SheetDescription>
                  Complete los detalles del registro
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <DynamicForm
                  open={true}
                  onOpenChange={() => {}}
                  fields={detailFields}
                  tableName={detailTitle}
                  onSave={handleDetailSave}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
