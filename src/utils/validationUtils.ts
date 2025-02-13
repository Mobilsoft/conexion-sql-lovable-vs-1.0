
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

interface FieldValidation {
  maxLength?: number;
  required?: boolean;
  type?: string;
  foreignKey?: {
    table: TableNames;
    field: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

// Definición de las restricciones de campos basada en la estructura de la base de datos
const fieldConstraints: Record<string, FieldValidation> = {
  nit: { maxLength: 20, required: true },
  dv: { maxLength: 1, required: true },
  razon_social: { maxLength: 255, required: true },
  tipo_contribuyente: { maxLength: 50, required: true },
  direccion: { maxLength: 255, required: true },
  telefono: { maxLength: 20, required: true },
  email: { maxLength: 100, required: true, type: 'email' },
  municipio: { maxLength: 100, required: true },
  master_detail: { maxLength: 10 },
  estado_empresa: { maxLength: 50 },
  naturaleza_empresa: { maxLength: 50 },
  tipo_empresa: { maxLength: 50 },
  // Definición de campos con llaves foráneas
  tipo_documento_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'tipos_documento', field: 'id' }
  },
  departamento_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'departamentos', field: 'id' }
  },
  ciudad_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'ciudades', field: 'id' }
  },
  pais_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'paises', field: 'id' }
  },
  codigo_ciiu_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'codigos_ciiu', field: 'id' }
  },
  actividad_comercial_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'actividades_comerciales', field: 'id' }
  },
  tipo_regimen_id: { 
    required: true, 
    type: 'number',
    foreignKey: { table: 'tipos_regimen_tributario', field: 'id' }
  }
};

// Función auxiliar para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para verificar si un ID existe en una tabla relacionada
const verifyForeignKeyExists = async (table: TableNames, field: string, value: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(field)
      .eq(field, value)
      .maybeSingle();
    
    if (error) {
      console.error(`Error verificando llave foránea en tabla ${table}:`, error);
      return false;
    }
    
    return data !== null;
  } catch (error) {
    console.error(`Error inesperado verificando llave foránea:`, error);
    return false;
  }
};

export const validateCompanyData = async (data: any): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];

  for (const [field, constraints] of Object.entries(fieldConstraints)) {
    const value = data[field];

    // Validar campos requeridos
    if (constraints.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `El campo ${field} es requerido`
      });
      continue;
    }

    // Si el campo está presente, validar según las restricciones
    if (value !== undefined && value !== null) {
      // Validar longitud máxima para strings
      if (constraints.maxLength && value.toString().length > constraints.maxLength) {
        errors.push({
          field,
          message: `El campo ${field} no puede exceder ${constraints.maxLength} caracteres`
        });
      }

      // Validar tipo de dato
      if (constraints.type === 'number' && isNaN(Number(value))) {
        errors.push({
          field,
          message: `El campo ${field} debe ser numérico`
        });
      }

      // Validar formato de email
      if (constraints.type === 'email' && !isValidEmail(value)) {
        errors.push({
          field,
          message: `El campo ${field} debe ser un email válido`
        });
      }

      // Validar llaves foráneas
      if (constraints.foreignKey && !isNaN(Number(value))) {
        const exists = await verifyForeignKeyExists(
          constraints.foreignKey.table,
          constraints.foreignKey.field,
          Number(value)
        );
        
        if (!exists) {
          errors.push({
            field,
            message: `El valor seleccionado para ${field} no existe en la tabla ${constraints.foreignKey.table}`
          });
        }
      }
    }
  }

  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => `${error.message}`).join('\n');
};
