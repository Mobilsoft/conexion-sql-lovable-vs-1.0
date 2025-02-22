
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { FormContent } from "./dynamic-form/FormContent";
import { DynamicFormProps } from "./dynamic-form/types";
import { calculateDV } from "@/utils/dvCalculator";

export function DynamicForm({ 
  open, 
  onOpenChange, 
  fields, 
  tableName, 
  onSave, 
  initialData 
}: DynamicFormProps) {
  const [selectedTipoDoc, setSelectedTipoDoc] = useState<string>('');

  // Filtrar campos que no deben mostrarse
  const visibleFields = fields.filter(field => (
    !field.name.includes('fecha_actualizacion') &&
    !field.name.includes('fecha_creacion')
  ));

  // Generar el esquema de validación dinámicamente
  const generateValidationSchema = () => {
    const schemaFields: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.type === 'number') {
        schemaFields[field.name] = field.required 
          ? z.number()
          : z.number().nullable();
      } else if (field.name === 'estado' || field.name === 'tabla_master') {
        schemaFields[field.name] = z.boolean().or(z.string());
      } else {
        schemaFields[field.name] = field.required 
          ? z.string()
          : z.string().nullable();
      }
    });
    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(generateValidationSchema()),
    defaultValues: initialData || {},
  });

  // Watch para el número de documento
  const numeroDocumento = form.watch('numero_documento');

  useEffect(() => {
    if (selectedTipoDoc === '31' && numeroDocumento) { // 31 = NIT
      const dv = calculateDV(numeroDocumento);
      form.setValue('dv', dv);
    }
  }, [numeroDocumento, selectedTipoDoc, form]);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = (data: any) => {
    // Formatear números antes de enviar
    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        return { ...acc, [key]: new Intl.NumberFormat('es-CO').format(value) };
      }
      if (key === 'tabla_master') {
        return { ...acc, [key]: value === true ? 'M' : 'D' };
      }
      if (key === 'estado') {
        return { ...acc, [key]: value === true ? 1 : 0 };
      }
      return { ...acc, [key]: value };
    }, {});

    onSave(formattedData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Editar ${tableName}` : `Nuevo ${tableName}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormContent 
              fields={visibleFields} 
              form={form}
              onTipoDocumentoChange={setSelectedTipoDoc}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {initialData ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
