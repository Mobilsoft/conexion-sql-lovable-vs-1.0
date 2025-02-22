
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "../types";

export function InputField({ field, form }: FormFieldProps) {
  return (
    <FormField
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
}
