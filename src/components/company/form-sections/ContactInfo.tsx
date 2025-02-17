
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/pages/Companies";

type FormData = z.infer<typeof formSchema>;

interface ContactInfoProps {
  form: UseFormReturn<FormData>;
}

export function ContactInfo({ form }: ContactInfoProps) {
  return (
    <>
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
    </>
  );
}
