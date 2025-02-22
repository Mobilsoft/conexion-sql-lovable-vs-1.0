
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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "./CustomerForm";

const customerSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  id_tipo_documento: z.number().min(1, "El tipo de documento es requerido"),
  numero_documento: z.string().min(1, "El número de documento es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  estado: z.boolean().default(true),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any | null;
}

export function CustomerDialog({ open, onOpenChange, customer }: CustomerDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      nombre: "",
      apellido: "",
      id_tipo_documento: 0,
      numero_documento: "",
      email: "",
      telefono: "",
      direccion: "",
      estado: true,
    },
  });

  const { data: tiposDocumento } = useQuery({
    queryKey: ['tiposDocumento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cio_tipos_documento')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const { error } = customer?.id 
        ? await supabase
            .from('cio_customers')
            .update(data)
            .eq('id', customer.id)
        : await supabase
            .from('cio_customers')
            .insert([data]);

      if (error) throw error;

      toast({
        title: customer?.id ? "Cliente actualizado" : "Cliente creado",
        description: customer?.id 
          ? "Los datos del cliente han sido actualizados correctamente."
          : "El nuevo cliente ha sido creado correctamente.",
      });

      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onOpenChange(false);
      form.reset();

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomerForm form={form} tiposDocumento={tiposDocumento || []} />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {customer?.id ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
