
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm } from "@/components/DynamicForm";
import { DynamicFormField } from "@/types/table-structure";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any | null;
}

export function CustomerDialog({ open, onOpenChange, customer }: CustomerDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Definición de los campos del formulario
  const fields: DynamicFormField[] = [
    {
      name: "nombre",
      type: "text",
      required: true,
      properties: {
        id: 1,
        table_name: "cio_customers",
        column_name: "nombre",
        display_type: "text",
        is_required: true,
        orden: 1,
        estado: true
      }
    },
    {
      name: "apellido",
      type: "text",
      required: true,
      properties: {
        id: 2,
        table_name: "cio_customers",
        column_name: "apellido",
        display_type: "text",
        is_required: true,
        orden: 2,
        estado: true
      }
    },
    {
      name: "id_tipo_documento",
      type: "number",
      required: true,
      properties: {
        id: 3,
        table_name: "cio_customers",
        column_name: "id_tipo_documento",
        display_type: "select",
        reference_table: "tipos_documento",
        reference_value_field: "id",
        reference_display_field: "nombre",
        is_required: true,
        orden: 3,
        estado: true
      }
    },
    {
      name: "numero_documento",
      type: "text",
      required: true,
      properties: {
        id: 4,
        table_name: "cio_customers",
        column_name: "numero_documento",
        display_type: "text",
        is_required: true,
        orden: 4,
        estado: true
      }
    },
    {
      name: "razon_social",
      type: "text",
      required: true,
      properties: {
        id: 5,
        table_name: "cio_customers",
        column_name: "razon_social",
        display_type: "text",
        is_required: true,
        orden: 5,
        estado: true
      }
    },
    {
      name: "email",
      type: "text",
      required: true,
      properties: {
        id: 6,
        table_name: "cio_customers",
        column_name: "email",
        display_type: "text",
        is_required: true,
        orden: 6,
        estado: true
      }
    },
    {
      name: "telefono",
      type: "text",
      required: true,
      properties: {
        id: 7,
        table_name: "cio_customers",
        column_name: "telefono",
        display_type: "text",
        is_required: true,
        orden: 7,
        estado: true
      }
    },
    {
      name: "direccion",
      type: "text",
      required: true,
      properties: {
        id: 8,
        table_name: "cio_customers",
        column_name: "direccion",
        display_type: "text",
        is_required: true,
        orden: 8,
        estado: true
      }
    },
    {
      name: "id_ciudad",
      type: "number",
      required: true,
      properties: {
        id: 9,
        table_name: "cio_customers",
        column_name: "id_ciudad",
        display_type: "select",
        reference_table: "ciudades",
        reference_value_field: "id",
        reference_display_field: "nombre",
        is_required: true,
        orden: 9,
        estado: true
      }
    },
    {
      name: "estado",
      type: "boolean",
      required: false,
      properties: {
        id: 10,
        table_name: "cio_customers",
        column_name: "estado",
        display_type: "switch",
        is_required: false,
        orden: 10,
        estado: true
      }
    }
  ];

  const handleSave = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        master_detail: 'M',
        estado: data.estado === true
      };

      const { error } = customer?.id 
        ? await supabase
            .from('cio_customers')
            .update(formattedData)
            .eq('id', customer.id)
        : await supabase
            .from('cio_customers')
            .insert([formattedData]);

      if (error) throw error;

      toast({
        title: customer?.id ? "Cliente actualizado" : "Cliente creado",
        description: customer?.id 
          ? "Los datos del cliente han sido actualizados correctamente."
          : "El nuevo cliente ha sido creado correctamente.",
      });

      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {customer?.id ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={fields}
          tableName="Cliente"
          onSave={handleSave}
          initialData={customer}
          open={open}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
