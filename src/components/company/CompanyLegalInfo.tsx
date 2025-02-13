
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TipoDocumento } from "@/types/company";
import { z } from "zod";

const formSchema = z.object({
  tipo_contribuyente: z.string(),
  tipo_documento_id: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyLegalInfoProps {
  form: UseFormReturn<FormData>;
  tiposDocumento: TipoDocumento[];
}

export function CompanyLegalInfo({ 
  form, 
  tiposDocumento 
}: CompanyLegalInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo_contribuyente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Contribuyente</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de contribuyente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Responsable de IVA</SelectItem>
                <SelectItem value="2">No Responsable de IVA</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tipo_documento_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Documento</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de documento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposDocumento.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
