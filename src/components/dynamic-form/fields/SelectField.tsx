
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "../types";

export function SelectField({ field, form, options = [], onTipoDocumentoChange }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="col-span-1">
          <FormLabel>{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
          <Select 
            onValueChange={(value) => {
              formField.onChange(value);
              if (field.name === 'tipo_documento_id' && onTipoDocumentoChange) {
                onTipoDocumentoChange(value);
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
