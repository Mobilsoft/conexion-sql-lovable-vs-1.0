
export interface TableStructure {
    id: number;
    table_name: string;
    column_name: string;
    data_type: string;
    is_nullable: boolean;
    column_default: string | null;
    sql_connection_id: number | null;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface FieldProperties {
    id: number;
    table_name: string;
    column_name: string;
    display_type: 'select' | 'switch' | 'calendar' | 'numeric' | 'text' | 'textarea';
    reference_table?: string;
    reference_value_field?: string;
    reference_display_field?: string;
    format_pattern?: string;
    default_value?: string;
    placeholder?: string;
    is_required: boolean;
    min_value?: string;
    max_value?: string;
    validation_regex?: string;
    validation_message?: string;
    orden: number;
    estado: boolean;
}

export interface DynamicFormField {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    options?: SelectOption[];
    properties?: FieldProperties;
}
