
interface FieldValidation {
  maxLength?: number;
  required?: boolean;
  type?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Definición de las restricciones de campos basadas en la estructura de la base de datos
const fieldConstraints: Record<string, FieldValidation> = {
  nit: { maxLength: 20, required: true },
  dv: { maxLength: 1, required: true },
  razon_social: { maxLength: 255, required: true },
  tipo_contribuyente: { maxLength: 50, required: true },
  direccion: { maxLength: 255, required: true },
  telefono: { maxLength: 20, required: true },
  email: { maxLength: 100, required: true },
  municipio: { maxLength: 100, required: true },
  master_detail: { maxLength: 10 },
  estado_empresa: { maxLength: 50 },
  naturaleza_empresa: { maxLength: 50 },
  tipo_empresa: { maxLength: 50 },
};

export const validateCompanyData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.entries(fieldConstraints).forEach(([field, constraints]) => {
    const value = data[field];

    // Validar campos requeridos
    if (constraints.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `El campo ${field} es requerido`
      });
      return;
    }

    // Validar longitud máxima
    if (constraints.maxLength && value && value.toString().length > constraints.maxLength) {
      errors.push({
        field,
        message: `El campo ${field} no puede exceder ${constraints.maxLength} caracteres`
      });
    }
  });

  // Validar campos numéricos
  const numericFields = ['tipo_documento_id', 'departamento_id', 'ciudad_id', 'pais_id', 'codigo_ciiu_id', 'actividad_comercial_id', 'tipo_regimen_id'];
  numericFields.forEach(field => {
    if (data[field] && isNaN(Number(data[field]))) {
      errors.push({
        field,
        message: `El campo ${field} debe ser numérico`
      });
    }
  });

  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => `${error.message}`).join('\n');
};
