
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Company } from '@/types/company';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formSchema } from '@/pages/Companies';
import { CompanyForm } from './CompanyForm';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useCompanyForm } from './useCompanyForm';
import { toast } from '@/hooks/use-toast';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany: Company | null;
  ciudades: any[];
  departamentos: any[];
}

export function CompanyDialog({ 
  open, 
  onOpenChange, 
  editingCompany,
  ciudades,
  departamentos
}: CompanyDialogProps) {
  const { codigosCIIU, actividadesComerciales, tiposRegimen } = useCompanyData();
  const { handleSubmit: handleFormSubmit } = useCompanyForm({ onOpenChange, editingCompany, departamentos, ciudades });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingCompany ? {
      tipo_documento_id: editingCompany.tipo_documento_id?.toString() || "",
      nit: editingCompany.nit || "",
      dv: editingCompany.dv || "",
      tipo_contribuyente: editingCompany.tipo_contribuyente || "",
      razon_social: editingCompany.razon_social || "",
      direccion: editingCompany.direccion || "",
      telefono: editingCompany.telefono || "",
      email: editingCompany.email || "",
      pais_id: editingCompany.pais_id?.toString() || "",
      departamento_id: editingCompany.departamento_id?.toString() || "",
      ciudad_id: editingCompany.ciudad_id?.toString() || "",
      codigo_ciiu_id: editingCompany.codigo_ciiu_id?.toString() || "",
      actividad_comercial_id: editingCompany.actividad_comercial_id?.toString() || "",
      tipo_regimen_id: editingCompany.tipo_regimen_id?.toString() || "",
      municipio: editingCompany.municipio || "",
    } : {
      tipo_documento_id: "",
      nit: "",
      dv: "",
      tipo_contribuyente: "",
      razon_social: "",
      direccion: "",
      telefono: "",
      email: "",
      pais_id: "",
      departamento_id: "",
      ciudad_id: "",
      codigo_ciiu_id: "",
      actividad_comercial_id: "",
      tipo_regimen_id: "",
      municipio: "",
    },
  });

  console.log('Form values:', form.getValues());

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('CompanyDialog - Formulario enviado con valores:', values);
      await handleFormSubmit(values);
      // Limpiar el formulario después de un guardado exitoso
      form.reset();
    } catch (error) {
      console.error('Error en CompanyDialog onSubmit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar el formulario.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset(); // Limpiar el formulario al cerrar el diálogo
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCompany ? "Editar Compañía" : "Nueva Compañía"}
          </DialogTitle>
          <DialogDescription>
            Completa los datos de la compañía para registrarla.
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => {
            form.reset(); // Limpiar el formulario al cancelar
            onOpenChange(false);
          }}
          editingCompany={!!editingCompany}
          ciudades={ciudades}
          departamentos={departamentos}
          codigosCIIU={codigosCIIU}
          actividadesComerciales={actividadesComerciales}
          tiposRegimen={tiposRegimen}
        />
      </DialogContent>
    </Dialog>
  );
}
