
-- ... keep existing code (ap_modules and ap_forms tables)

-- Tabla para almacenar las propiedades extendidas de los campos
CREATE TABLE field_properties (
    id INT IDENTITY(1,1) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    display_type VARCHAR(50) NOT NULL, -- 'select', 'switch', 'calendar', 'numeric', 'text', etc.
    reference_table VARCHAR(100), -- Para campos tipo select, indica la tabla de referencia
    reference_value_field VARCHAR(100), -- Campo que se usa como valor en el select
    reference_display_field VARCHAR(100), -- Campo que se muestra en el select
    format_pattern VARCHAR(50), -- Patrón de formato (ej: '###,###,###.##' para números)
    default_value VARCHAR(MAX),
    placeholder VARCHAR(255),
    is_required BIT DEFAULT 0,
    min_value VARCHAR(50),
    max_value VARCHAR(50),
    validation_regex VARCHAR(255),
    validation_message VARCHAR(255),
    orden INT,
    estado BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UC_TableColumn UNIQUE (table_name, column_name)
);

-- Insertar algunas propiedades de ejemplo para gen_empresas
INSERT INTO field_properties (
    table_name, 
    column_name, 
    display_type, 
    reference_table, 
    reference_value_field, 
    reference_display_field,
    format_pattern,
    is_required,
    orden
) VALUES 
-- Campos tipo selector
('gen_empresas', 'id_tipo_regimen', 'select', 'tipos_regimen', 'id', 'nombre', NULL, 1, 1),
('gen_empresas', 'id_actividad_comercial', 'select', 'actividades_comerciales', 'id', 'nombre', NULL, 1, 2),
('gen_empresas', 'id_ciudad', 'select', 'ciudades', 'id', 'nombre', NULL, 1, 3),

-- Campos tipo switch
('gen_empresas', 'estado', 'switch', NULL, NULL, NULL, NULL, 1, 4),
('gen_empresas', 'tabla_master', 'switch', NULL, NULL, NULL, NULL, 1, 5),

-- Campos numéricos
('gen_empresas', 'valor_activos', 'numeric', NULL, NULL, NULL, '###,###,###.##', 0, 6),
('gen_empresas', 'valor_ventas', 'numeric', NULL, NULL, NULL, '###,###,###.##', 0, 7),

-- Campos fecha
('gen_empresas', 'fecha_constitucion', 'calendar', NULL, NULL, NULL, 'DD/MM/YYYY', 1, 8);

-- Renombrar y modificar la tabla de configuraciones
-- ... keep existing code (app_form_configurations table)
