
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Pais, Departamento, Ciudad } from "@/types/company";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const formSchema = z.object({
  pais_id: z.string(),
  departamento_id: z.string(),
  ciudad_id: z.string(),
  direccion: z.string(),
  email: z.string().email("Email inválido"),
  telefono: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyContactInfoProps {
  form: UseFormReturn<FormData>;
  paises: Pais[];
  departamentos: Departamento[];
  ciudades: Ciudad[];
}

export function CompanyContactInfo({ 
  form, 
  paises, 
  departamentos, 
  ciudades 
}: CompanyContactInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="pais_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>País</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el país" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {paises.map((pais) => (
                  <SelectItem key={pais.id} value={pais.id.toString()}>
                    {pais.nombre}
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
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el departamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departamentos.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id.toString()}>
                    {depto.nombre}
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
        name="ciudad_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la ciudad" />
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
        name="direccion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
