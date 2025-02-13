
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CompanyBasicInfo } from './CompanyBasicInfo';
import { CompanyCommercialInfo } from './CompanyCommercialInfo';
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from '@/pages/Companies';

interface CompanyFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  onCancel: () => void;
  editingCompany: boolean;
  ciudades: any[];
  departamentos: any[];
  codigosCIIU: any[];
  actividadesComerciales: any[];
  tiposRegimen: any[];
}

export function CompanyForm({
  form,
  onSubmit,
  onCancel,
  editingCompany,
  ciudades,
  departamentos,
  codigosCIIU,
  actividadesComerciales,
  tiposRegimen
}: CompanyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 bg-[#F2FCE2] hover:bg-[#E5F7D3] rounded-t-lg">
              <span className="font-medium text-[#2E7D32]">Información Básica</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white">
              <CompanyBasicInfo 
                form={form} 
                ciudades={ciudades} 
                departamentos={departamentos}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 bg-[#F2FCE2] hover:bg-[#E5F7D3] rounded-t-lg">
              <span className="font-medium text-[#2E7D32]">Información Comercial</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white">
              <CompanyCommercialInfo 
                form={form}
                codigosCIIU={codigosCIIU}
                actividadesComerciales={actividadesComerciales}
                tiposRegimen={tiposRegimen}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {editingCompany ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
