
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Ciudad, Departamento } from "@/types/company";
import { formSchema } from "../../pages/Companies";
import { DocumentInfo } from "./form-sections/DocumentInfo";
import { ContactInfo } from "./form-sections/ContactInfo";
import { LocationInfo } from "./form-sections/LocationInfo";

type FormData = z.infer<typeof formSchema>;

interface CompanyBasicInfoProps {
  form: UseFormReturn<FormData>;
  ciudades: Ciudad[];
  departamentos: Departamento[];
}

export function CompanyBasicInfo({ form, ciudades, departamentos }: CompanyBasicInfoProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <DocumentInfo form={form} />
      <ContactInfo form={form} />
      <LocationInfo form={form} ciudades={ciudades} departamentos={departamentos} />
    </div>
  );
}
