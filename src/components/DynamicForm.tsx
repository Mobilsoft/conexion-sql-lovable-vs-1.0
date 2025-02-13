
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { DynamicFormField } from "@/types/table-structure";

interface DynamicFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: DynamicFormField[];
  tableName: string;
  onSave: (data: any) => void;
  initialData?: any;
}

export function DynamicForm({ 
  open, 
  onOpenChange, 
  fields, 
  tableName, 
  onSave, 
  initialData 
}: DynamicFormProps) {
  // Construir el esquema de validación dinámicamente
  const generateValidationSchema = () => {
    const schemaFields: { [key: string]: any } = {};
    fields.forEach((field) => {
      let fieldSchema = z.string();
      if (field.type === 'number') {
        fieldSchema = z.string().transform((val) => Number(val));
      }
      schemaFields[field.name] = field.required ? fieldSchema : fieldSchema.nullish();
    });
    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(generateValidationSchema()),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = (data: any) => {
    onSave(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Editar ${tableName}` : `Nuevo ${tableName}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.name}</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={`Ingrese ${field.name}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
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
