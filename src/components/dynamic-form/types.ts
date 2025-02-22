
import { DynamicFormField } from "@/types/table-structure";

export interface DynamicFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: DynamicFormField[];
  tableName: string;
  onSave: (data: any) => void;
  initialData?: any;
}

export interface FormFieldProps {
  field: DynamicFormField;
  form: any;
  options?: any[];
  onTipoDocumentoChange?: (value: string) => void;
}
