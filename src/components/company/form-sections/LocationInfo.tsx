
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Ciudad, Departamento } from "@/types/company";
import { useEffect } from "react";
import { z } from "zod";
import { formSchema } from "@/pages/Companies";

type FormData = z.infer<typeof formSchema>;

interface LocationInfoProps {
  form: UseFormReturn<FormData>;
  ciudades: Ciudad[];
  departamentos: Departamento[];
}

export function LocationInfo({ form, ciudades, departamentos }: LocationInfoProps) {
  const selectedCiudadId = useWatch({ control: form.control, name: "ciudad_id" });

  useEffect(() => {
    if (selectedCiudadId) {
      const ciudad = ciudades.find(c => c.id.toString() === selectedCiudadId);
      if (ciudad) {
        const departamento = departamentos.find(d => d.id === ciudad.departamento_id);
        if (departamento) {
          form.setValue("departamento_id", departamento.id.toString());
        }
      }
    }
  }, [selectedCiudadId, ciudades, departamentos, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="ciudad_id"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Ciudad</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione ciudad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ciudades.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                    {ciudad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departamento_id"
        render={({ field }) => (
          <FormItem className="col-span-3">
            <FormLabel>Departamento</FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly
                value={departamentos.find(d => d.id.toString() === field.value)?.nombre || ''}
                className="bg-gray-100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tabla_master"
        render={({ field }) => (
          <FormItem className="col-span-2 flex flex-col">
            <FormLabel>Registro Principal</FormLabel>
            <FormControl>
              <Switch
                checked={field.value === 'M'}
                onCheckedChange={(checked) => field.onChange(checked ? 'M' : 'D')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
