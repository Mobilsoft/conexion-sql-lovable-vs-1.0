import { DynamicFormField } from "@/types/table-structure";
import { SwitchField } from "./fields/SwitchField";
import { SelectField } from "./fields/SelectField";
import { InputField } from "./fields/InputField";
import { useRelatedData } from "./hooks/useRelatedData";

interface FormContentProps {
  fields: DynamicFormField[];
  form: any;
  onTipoDocumentoChange: (value: string) => void;
}

export function FormContent({ fields, form, onTipoDocumentoChange }: FormContentProps) {
  const { 
    tiposDocumento,
    ciudades,
    departamentos,
    tiposRegimen,
    actividadesComerciales 
  } = useRelatedData();

  const getOptionsForField = (field: DynamicFormField) => {
    if (!field.properties?.reference_table) return [];

    switch (field.properties.reference_table) {
      case 'tipos_documento':
        return tiposDocumento;
      case 'ciudades':
        return ciudades;
      case 'departamentos':
        return departamentos;
      case 'tipos_regimen':
        return tiposRegimen;
      case 'actividades_comerciales':
        return actividadesComerciales;
      default:
        return [];
    }
  };

  const renderFormField = (field: DynamicFormField) => {
    // Si el campo tiene propiedades extendidas, las usamos
    if (field.properties) {
      switch (field.properties.display_type) {
        case 'switch':
          return <SwitchField key={field.name} field={field} form={form} />;
        
        case 'select':
          return (
            <SelectField 
              key={field.name}
              field={field}
              form={form}
              options={getOptionsForField(field)}
              onTipoDocumentoChange={onTipoDocumentoChange}
            />
          );
        
        case 'numeric':
          return (
            <InputField 
              key={field.name} 
              field={{
                ...field,
                type: 'number',
                format: field.properties.format_pattern
              }} 
              form={form} 
            />
          );

        case 'calendar':
          return (
            <InputField 
              key={field.name} 
              field={{
                ...field,
                type: 'date',
                format: field.properties.format_pattern
              }} 
              form={form} 
            />
          );

        default:
          return <InputField key={field.name} field={field} form={form} />;
      }
    }

    // Comportamiento existente para campos sin propiedades extendidas
    // Campos tipo switch
    if (field.name === 'estado' || field.name === 'tabla_master') {
      return <SwitchField key={field.name} field={field} form={form} />;
    }

    // Si es un campo relacionado (selector)
    if (field.name.startsWith('id_')) {
      const relationName = field.name.replace('id_', '');
      let options: any[] = [];
      
      switch (relationName) {
        case 'ciudad':
          options = ciudades;
          break;
        case 'departamento':
          options = departamentos;
          break;
        case 'tipo_documento':
          options = tiposDocumento;
          break;
        case 'tipo_regimen':
          options = tiposRegimen;
          break;
        case 'actividad_comercial':
          options = actividadesComerciales;
          break;
      }

      return (
        <SelectField 
          key={field.name}
          field={field}
          form={form}
          options={options}
          onTipoDocumentoChange={onTipoDocumentoChange}
        />
      );
    }

    // Campo normal
    return <InputField key={field.name} field={field} form={form} />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {fields.map(renderFormField)}
    </div>
  );
}
