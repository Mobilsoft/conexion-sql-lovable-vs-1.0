
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
        display_type: "text"
      }
    },
    {
      name: "apellido",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "id_tipo_documento",
      type: "number",
      required: true,
      properties: {
        display_type: "select",
        reference_table: "tipos_documento"
      }
    },
    {
      name: "numero_documento",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "razon_social",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "email",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "telefono",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "direccion",
      type: "text",
      required: true,
      properties: {
        display_type: "text"
      }
    },
    {
      name: "id_ciudad",
      type: "number",
      required: true,
      properties: {
        display_type: "select",
        reference_table: "ciudades"
      }
    },
    {
      name: "estado",
      type: "boolean",
      required: false,
      properties: {
        display_type: "switch"
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
