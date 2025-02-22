
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { DynamicFormField } from "@/types/table-structure";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateDV } from "@/utils/dvCalculator";

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
  const [selectedTipoDoc, setSelectedTipoDoc] = useState<string>('');

  // Consultas para obtener datos de las tablas relacionadas
  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ['tipos_documento'],
    queryFn: async () => {
      const { data } = await supabase.from('tipos_documento').select('*');
      return data || [];
    }
  });

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ciudades')
        .select(`
          id,
          nombre,
          departamento:departamentos (
            id,
            nombre
          )
        `);
      return data || [];
    }
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const { data } = await supabase.from('departamentos').select('*');
      return data || [];
    }
  });

  const { data: tiposRegimen = [] } = useQuery({
    queryKey: ['tipos_regimen'],
    queryFn: async () => {
      const { data } = await supabase.from('tipos_regimen_tributario').select('*');
      return data || [];
    }
  });

  const { data: actividadesComerciales = [] } = useQuery({
    queryKey: ['actividades_comerciales'],
    queryFn: async () => {
      const { data } = await supabase.from('actividades_comerciales').select('*');
      return data || [];
    }
  });

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
      } else if (field.name === 'estado' || field.name === 'master_detail') {
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

  // Watch para el número de documento y tipo de documento
  const numeroDocumento = form.watch('numero_documento');
  const tipoDocumentoId = form.watch('tipo_documento_id');

  useEffect(() => {
    if (tipoDocumentoId) {
      setSelectedTipoDoc(tipoDocumentoId);
    }
  }, [tipoDocumentoId]);

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
      if (key === 'master_detail') {
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

  const renderFormField = (field: DynamicFormField) => {
    // Campos tipo switch
    if (field.name === 'estado' || field.name === 'master_detail') {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-1 flex flex-col">
              <FormLabel>
                {field.name === 'master_detail' ? 'Registro Principal' : 'Estado'}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={formField.value === true || formField.value === 'M' || formField.value === 1}
                  onCheckedChange={formField.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    // Si es un campo relacionado (selector)
    if (field.name.startsWith('id_')) {
      const relationName = field.name.replace('id_', '');
      let options: any[] = [];
      
      switch (relationName) {
        case 'ciudad':
          options = ciudades;
          break;
        case 'departamento':
          options = departamentos;
          break;
        case 'tipo_documento':
          options = tiposDocumento;
          break;
        case 'tipo_regimen':
          options = tiposRegimen;
          break;
        case 'actividad_comercial':
          options = actividadesComerciales;
          break;
      }

      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-1">
              <FormLabel>{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
              <Select 
                onValueChange={(value) => {
                  formField.onChange(value);
                  if (field.name === 'tipo_documento_id') {
                    setSelectedTipoDoc(value);
                  }
                }} 
                value={formField.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Seleccione ${field.name.replace(/_/g, ' ')}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.nombre}
                      {option.departamento && ` - ${option.departamento.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    // Campo normal
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className="col-span-1">
            <FormLabel>{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
            <FormControl>
              <Input 
                {...formField} 
                type={field.type === 'number' ? 'text' : 'text'}
                placeholder={`Ingrese ${field.name.replace(/_/g, ' ')}`}
                onChange={(e) => {
                  if (field.type === 'number') {
                    // Formatear números mientras se escriben
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    formField.onChange(value ? parseInt(value) : '');
                  } else {
                    formField.onChange(e);
                  }
                }}
                value={
                  field.type === 'number' && formField.value
                    ? new Intl.NumberFormat('es-CO').format(formField.value)
                    : formField.value || ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {visibleFields.map(renderFormField)}
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
