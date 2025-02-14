
import mssql from "npm:mssql@9.1.1"

export const initializeDatabase = async (pool: mssql.ConnectionPool) => {
  console.log('Iniciando proceso de inicialización de base de datos...')
  
  try {
    // Crear tablas base
    await createBaseTables(pool)
    
    // Insertar datos de prueba
    await insertTestData(pool)
    
    console.log('Base de datos inicializada exitosamente')
    return true
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error)
    throw error
  }
}

const createBaseTables = async (pool: mssql.ConnectionPool) => {
  console.log('Creando tablas base...')
  
  // Crear tabla tipos_documento si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tipos_documento')
    CREATE TABLE tipos_documento (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      codigo VARCHAR(10),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla tipos_regimen_tributario si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tipos_regimen_tributario')
    CREATE TABLE tipos_regimen_tributario (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla paises si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'paises')
    CREATE TABLE paises (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      codigo VARCHAR(10),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla departamentos si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'departamentos')
    CREATE TABLE departamentos (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      codigo VARCHAR(10),
      pais_id INT REFERENCES paises(id),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla ciudades si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ciudades')
    CREATE TABLE ciudades (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      codigo VARCHAR(10),
      departamento_id INT REFERENCES departamentos(id),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla codigos_ciiu si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'codigos_ciiu')
    CREATE TABLE codigos_ciiu (
      id INT IDENTITY(1,1) PRIMARY KEY,
      codigo VARCHAR(10) NOT NULL,
      descripcion TEXT NOT NULL,
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla actividades_comerciales si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'actividades_comerciales')
    CREATE TABLE actividades_comerciales (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT,
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      master_detail CHAR(1) DEFAULT 'M'
    )
  `)

  // Crear tabla companies si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'companies')
    CREATE TABLE companies (
      nit VARCHAR(20) PRIMARY KEY,
      dv VARCHAR(1) NOT NULL,
      razon_social VARCHAR(255) NOT NULL,
      tipo_documento_id INT REFERENCES tipos_documento(id),
      tipo_contribuyente VARCHAR(50) NOT NULL,
      direccion VARCHAR(255) NOT NULL,
      direccion_principal VARCHAR(255),
      telefono VARCHAR(20) NOT NULL,
      telefono_movil VARCHAR(20),
      email VARCHAR(255) NOT NULL,
      correo_electronico VARCHAR(255),
      departamento_id INT REFERENCES departamentos(id),
      departamento VARCHAR(100),
      ciudad_id INT REFERENCES ciudades(id),
      ciudad VARCHAR(100),
      pais_id INT REFERENCES paises(id),
      codigo_ciiu_id INT REFERENCES codigos_ciiu(id),
      actividad_comercial_id INT REFERENCES actividades_comerciales(id),
      tipo_regimen_id INT REFERENCES tipos_regimen_tributario(id),
      municipio VARCHAR(100) NOT NULL,
      master_detail CHAR(1) DEFAULT 'M',
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE()
    )
  `)

  console.log('Tablas base creadas exitosamente')
}

const insertTestData = async (pool: mssql.ConnectionPool) => {
  console.log('Insertando datos de prueba...')

  try {
    // Insertar tipos de documento
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM tipos_documento)
      INSERT INTO tipos_documento (nombre, codigo) VALUES 
      ('Cédula de Ciudadanía', 'CC'),
      ('NIT', 'NIT'),
      ('Cédula de Extranjería', 'CE'),
      ('Pasaporte', 'PAS')
    `)

    // Insertar tipos de régimen tributario
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM tipos_regimen_tributario)
      INSERT INTO tipos_regimen_tributario (nombre, descripcion) VALUES 
      ('Régimen Simple', 'Régimen de tributación simple'),
      ('Régimen Ordinario', 'Régimen de tributación ordinario'),
      ('Gran Contribuyente', 'Régimen de gran contribuyente'),
      ('No Responsable', 'No responsable de IVA')
    `)

    // Insertar países
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM paises)
      INSERT INTO paises (nombre, codigo) VALUES 
      ('Colombia', 'CO'),
      ('Estados Unidos', 'USA'),
      ('España', 'ES'),
      ('México', 'MX')
    `)

    // Insertar departamentos
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM departamentos)
      INSERT INTO departamentos (nombre, codigo, pais_id)
      SELECT 'Cundinamarca', 'CUN', id FROM paises WHERE codigo = 'CO'
      UNION ALL
      SELECT 'Antioquia', 'ANT', id FROM paises WHERE codigo = 'CO'
      UNION ALL
      SELECT 'Valle del Cauca', 'VAL', id FROM paises WHERE codigo = 'CO'
      UNION ALL
      SELECT 'Atlántico', 'ATL', id FROM paises WHERE codigo = 'CO'
    `)

    // Insertar ciudades
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM ciudades)
      INSERT INTO ciudades (nombre, codigo, departamento_id)
      SELECT 'Bogotá D.C.', 'BOG', id FROM departamentos WHERE nombre = 'Cundinamarca'
      UNION ALL
      SELECT 'Medellín', 'MED', id FROM departamentos WHERE nombre = 'Antioquia'
      UNION ALL
      SELECT 'Cali', 'CAL', id FROM departamentos WHERE nombre = 'Valle del Cauca'
      UNION ALL
      SELECT 'Barranquilla', 'BAQ', id FROM departamentos WHERE nombre = 'Atlántico'
    `)

    // Insertar códigos CIIU
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM codigos_ciiu)
      INSERT INTO codigos_ciiu (codigo, descripcion) VALUES 
      ('6201', 'Desarrollo de sistemas informáticos'),
      ('6202', 'Consultoría informática'),
      ('7020', 'Actividades de consultoría de gestión'),
      ('4651', 'Comercio al por mayor de computadores y equipos periféricos'),
      ('6209', 'Otras actividades de tecnología de información')
    `)

    // Insertar actividades comerciales
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM actividades_comerciales)
      INSERT INTO actividades_comerciales (nombre, descripcion) VALUES 
      ('Desarrollo de Software', 'Desarrollo de aplicaciones y sistemas'),
      ('Consultoría TI', 'Servicios de consultoría en tecnología'),
      ('Servicios Profesionales', 'Prestación de servicios profesionales'),
      ('Comercio Tecnología', 'Venta de equipos y software'),
      ('Soporte Técnico', 'Servicios de soporte y mantenimiento')
    `)

    console.log('Datos de prueba insertados exitosamente')
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error)
    throw error
  }
}

