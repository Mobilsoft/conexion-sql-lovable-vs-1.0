import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Using the existing form schema from Companies.tsx
const formSchema = z.object({
  nit: z.string().min(1, "El NIT es requerido"),
  dv: z.string().min(1, "El DV es requerido"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  email: z.string().email("Email inválido"),
  telefono: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyBasicInfoProps {
  form: UseFormReturn<FormData>;
}

export function CompanyBasicInfo({ form }: CompanyBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        <FormField
          control={form.control}
          name="nit"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>DV</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="razon_social"
        render={({ field }) => (
          <FormItem>
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
        name="telefono"
        render={({ field }) => (
          <FormItem>
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
          <FormItem>
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
    </div>
  );
}
