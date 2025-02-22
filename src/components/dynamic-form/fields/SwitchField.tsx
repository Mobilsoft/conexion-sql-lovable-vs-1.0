
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormFieldProps } from "../types";

export function SwitchField({ field, form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="col-span-1 flex flex-col">
          <FormLabel>
            {field.name === 'tabla_master' ? 'Registro Principal' : 'Estado'}
          </FormLabel>
          <FormControl>
            <Switch
              checked={formField.value === true || formField.value === 'M' || formField.value === 1}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
