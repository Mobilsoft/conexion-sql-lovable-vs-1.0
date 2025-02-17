
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { calculateDV } from "@/utils/dvCalculator";
import { z } from "zod";
import { formSchema } from "@/pages/Companies";

type FormData = z.infer<typeof formSchema>;

interface DocumentInfoProps {
  form: UseFormReturn<FormData>;
}

export function DocumentInfo({ form }: DocumentInfoProps) {
  const nit = form.watch("nit");
  const tipoDocumento = form.watch("tipo_documento_id");

  useEffect(() => {
    if (nit && tipoDocumento === "2") { // 2 = NIT
      const dv = calculateDV(nit);
      form.setValue("dv", dv);
    } else {
      form.setValue("dv", "");
    }
  }, [nit, tipoDocumento, form]);

  return (
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
                <SelectItem value="PJ-RC">Persona Jurídica - Régimen Común</SelectItem>
                <SelectItem value="PJ-GC">Persona Jurídica - Gran Contribuyente</SelectItem>
                <SelectItem value="PJ-RS">Persona Jurídica - Régimen Simplificado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
