
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
  id?: string;
  name: string;
  description?: string;
  display: string;
  settings: {
    title: string;
    theme: string;
  };
  components: (FormFieldConfiguration | FormAccordionConfiguration)[];
}
