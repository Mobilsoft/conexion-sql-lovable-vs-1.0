
import { useState } from "react";
import { FormConfigurationService } from "@/services/form-configuration.service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormConfiguration } from "@/types/form-configuration";

interface FormConfigurationSaverProps {
  configuration: Omit<FormConfiguration, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>;
  configService: FormConfigurationService;
}

export const FormConfigurationSaver = ({ configuration, configService }: FormConfigurationSaverProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await configService.saveConfiguration(configuration);
      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? "Guardando..." : "Guardar Configuración"}
    </Button>
  );
};
