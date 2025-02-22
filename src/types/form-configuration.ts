
export interface Module {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  estado: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Form {
  id: number;
  module_id: number;
  nombre: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  orden?: number;
  estado: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface FormFieldConfiguration {
  type: string;
  label: string;
  key: string;
  placeholder?: string;
  input: boolean;
  tableView: boolean;
  disabled?: boolean;
  defaultValue?: any;
  data?: {
    values?: Array<{ label: string; value: string }>;
    url?: string;
  };
  prefix?: {
    icon?: string;
  };
}

export interface FormSectionConfiguration {
  type: 'section';
  label: string;
  key: string;
  components: FormFieldConfiguration[];
}

export interface FormAccordionConfiguration {
  type: 'accordion';
  label: string;
  key: string;
  components: (FormFieldConfiguration | FormSectionConfiguration)[];
}

export interface FormConfiguration {
  id: number;
  form_id: number;
  nombre: string;
  descripcion?: string;
  configuracion: {
    display: string;
    settings: {
      title: string;
      theme: string;
    };
    components: (FormFieldConfiguration | FormAccordionConfiguration)[];
  };
  estado: boolean;
  tabla_master: 'M' | 'D';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
