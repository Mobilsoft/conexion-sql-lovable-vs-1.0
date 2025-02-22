
import { useEffect, useState } from "react";
import { FormConfiguration, FormFieldConfiguration } from "@/types/form-configuration";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormConfigurationService } from "@/services/form-configuration.service";

interface DynamicFormRendererProps {
  formId: number;
  configService: FormConfigurationService;
  onSubmit?: (data: any) => void;
}

export const DynamicFormRenderer = ({ formId, configService, onSubmit }: DynamicFormRendererProps) => {
  const [config, setConfig] = useState<FormConfiguration | null>(null);
  const { toast } = useToast();
  const form = useForm();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configuration = await configService.getFormConfiguration(formId);
        setConfig(configuration);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración del formulario",
          variant: "destructive",
        });
      }
    };

    loadConfig();
  }, [formId, configService]);

  const renderField = (field: FormFieldConfiguration) => {
    switch (field.type) {
      case 'textfield':
        return (
          <Input
            placeholder={field.placeholder}
            {...form.register(field.key)}
            disabled={field.disabled}
          />
        );
      case 'select':
        return (
          <Select
            onValueChange={(value) => form.setValue(field.key, value)}
            defaultValue={form.getValues(field.key)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.data?.values?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
        return (
          <Switch
            checked={form.getValues(field.key) === 'M'}
            onCheckedChange={(checked) => 
              form.setValue(field.key, checked ? 'M' : 'D')
            }
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      toast({
        title: "Éxito",
        description: "Formulario enviado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!config) return <div>Cargando...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {config.configuracion.components.map((component: any, index) => {
            if (component.type === 'accordion') {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{component.label}</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    {component.components.map((field: FormFieldConfiguration, fieldIndex: number) => (
                      <div key={fieldIndex} className="space-y-2">
                        <label className="text-sm font-medium">{field.label}</label>
                        {renderField(field)}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            }
            return renderField(component);
          })}
        </Accordion>
        <div className="flex justify-end space-x-2">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
};
