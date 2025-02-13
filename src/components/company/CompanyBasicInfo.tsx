import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Mail, Phone } from "lucide-react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ciudad, Departamento } from "@/types/company";
import { useEffect } from "react";
import { calculateDV } from "@/utils/dvCalculator";
import { formSchema } from "../../pages/Companies";

type FormData = z.infer<typeof formSchema>;

interface CompanyBasicInfoProps {
  form: UseFormReturn<FormData>;
  ciudades: Ciudad[];
  departamentos: Departamento[];
}

export function CompanyBasicInfo({ form, ciudades, departamentos }: CompanyBasicInfoProps) {
  const nit = useWatch({ control: form.control, name: "nit" });
  const selectedCiudadId = useWatch({ control: form.control, name: "ciudad_id" });

  useEffect(() => {
    if (nit) {
      const dv = calculateDV(nit);
      form.setValue("dv", dv);
    } else {
      form.setValue("dv", "");
    }
  }, [nit, form]);

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
    <div className="grid grid-cols-12 gap-4">
      <div className="grid grid-cols-12 gap-4 col-span-12">
        <FormField
          control={form.control}
          name="tipo_documento_id"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">NIT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nit"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>NIT</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    className="pl-8"
                    placeholder="Ej: 900123456"
                  />
                </FormControl>
                <Building2 className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dv"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>DV</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo_contribuyente"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <FormLabel>Tipo de Contribuyente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Responsable de IVA">Responsable de IVA</SelectItem>
                  <SelectItem value="No Responsable de IVA">No Responsable de IVA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="razon_social"
        render={({ field }) => (
          <FormItem className="col-span-5">
            <FormLabel>Razón Social</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nombre legal de la empresa"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="direccion"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Dirección de la empresa"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="telefono"
        render={({ field }) => (
          <FormItem className="col-span-3">
            <FormLabel>Teléfono</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  className="pl-8"
                  placeholder="Ej: 3001234567"
                />
              </FormControl>
              <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Correo Electrónico</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="pl-8"
                  placeholder="empresa@ejemplo.com"
                />
              </FormControl>
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </div>
  );
}
