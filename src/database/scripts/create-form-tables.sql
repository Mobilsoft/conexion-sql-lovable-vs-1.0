
-- Tabla de módulos
CREATE TABLE ap_modules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    orden INT,
    estado BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME DEFAULT GETDATE()
);

-- Tabla de formularios
CREATE TABLE ap_forms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    module_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ruta VARCHAR(255),
    icono VARCHAR(50),
    orden INT,
    tipo_formulario CHAR(1) DEFAULT 'S', -- 'S': Simple, 'M': Master, 'D': Detail
    master_form_id INT NULL, -- Referencia al formulario maestro si es un detalle
    estado BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (module_id) REFERENCES ap_modules(id),
    FOREIGN KEY (master_form_id) REFERENCES ap_forms(id)
);

-- Renombrar y modificar la tabla de configuraciones
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[form_configurations]') AND type in (N'U'))
BEGIN
    EXEC sp_rename 'form_configurations', 'app_form_configurations';
END
ELSE
BEGIN
    CREATE TABLE app_form_configurations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        form_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        configuracion NVARCHAR(MAX),
        estado BIT DEFAULT 1,
        tabla_master CHAR(1) DEFAULT 'D', -- 'M': Master, 'D': Detail
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_actualizacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (form_id) REFERENCES ap_forms(id)
    );
END
