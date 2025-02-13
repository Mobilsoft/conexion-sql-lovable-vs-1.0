
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CodigoCIIU, ActividadComercial } from "@/types/company";
import { z } from "zod";

const formSchema = z.object({
  codigo_ciiu_id: z.string(),
  actividad_comercial_id: z.string(),
  tipo_regimen_id: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyCommercialInfoProps {
  form: UseFormReturn<FormData>;
  codigosCIIU: CodigoCIIU[];
  actividadesComerciales: ActividadComercial[];
  tiposRegimen: any[];
}

export function CompanyCommercialInfo({ 
  form, 
  codigosCIIU, 
  actividadesComerciales, 
  tiposRegimen 
}: CompanyCommercialInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="codigo_ciiu_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código CIIU</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el código CIIU" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {codigosCIIU.map((ciiu) => (
                  <SelectItem key={ciiu.id} value={ciiu.id.toString()}>
                    {ciiu.codigo} - {ciiu.descripcion}
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
        name="actividad_comercial_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actividad Comercial</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la actividad comercial" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {actividadesComerciales.map((actividad) => (
                  <SelectItem key={actividad.id} value={actividad.id.toString()}>
                    {actividad.nombre}
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
        name="tipo_regimen_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Régimen Tributario</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de régimen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposRegimen.map((tipo) => (
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
