
import mssql from "npm:mssql@9.1.1"

export const initializeDatabase = async (pool: mssql.ConnectionPool) => {
  console.log('Iniciando proceso de inicialización de base de datos...')
  
  try {
    // Crear tablas base
    await createBaseTables(pool)
    console.log('✅ Tablas base creadas exitosamente')
    
    // Insertar datos de prueba
    await insertTestData(pool)
    console.log('✅ Datos de prueba insertados exitosamente')
    
    return true
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error)
    throw error
  }
}

const createBaseTables = async (pool: mssql.ConnectionPool) => {
  console.log('🏗️ Creando tablas base...')
  
  // Crear tabla tipos_documento si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tipos_documento')
    BEGIN
      CREATE TABLE tipos_documento (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(10),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla tipos_documento creada.'
    END
  `)

  // Crear tabla tipos_regimen_tributario si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tipos_regimen_tributario')
    BEGIN
      CREATE TABLE tipos_regimen_tributario (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla tipos_regimen_tributario creada.'
    END
  `)

  // Crear tabla paises si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'paises')
    BEGIN
      CREATE TABLE paises (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(10),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla paises creada.'
    END
  `)

  // Crear tabla departamentos si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'departamentos')
    BEGIN
      CREATE TABLE departamentos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(10),
        pais_id INT REFERENCES paises(id),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla departamentos creada.'
    END
  `)

  // Crear tabla ciudades si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ciudades')
    BEGIN
      CREATE TABLE ciudades (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(10),
        departamento_id INT REFERENCES departamentos(id),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla ciudades creada.'
    END
  `)

  // Crear tabla codigos_ciiu si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'codigos_ciiu')
    BEGIN
      CREATE TABLE codigos_ciiu (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(10) NOT NULL,
        descripcion TEXT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla codigos_ciiu creada.'
    END
  `)

  // Crear tabla actividades_comerciales si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'actividades_comerciales')
    BEGIN
      CREATE TABLE actividades_comerciales (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        master_detail CHAR(1) DEFAULT 'M'
      )
      PRINT 'Tabla actividades_comerciales creada.'
    END
  `)

  // Crear tabla companies si no existe
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'companies')
    BEGIN
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
      PRINT 'Tabla companies creada.'
    END
  `)
}

const insertTestData = async (pool: mssql.ConnectionPool) => {
  console.log('📝 Insertando datos de prueba...')

  try {
    // Insertar tipos de documento si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM tipos_documento)
      BEGIN
        SET IDENTITY_INSERT tipos_documento ON
        INSERT INTO tipos_documento (id, nombre, codigo, master_detail) VALUES 
        (1, 'Cédula de Ciudadanía', 'CC', 'M'),
        (2, 'NIT', 'NIT', 'M'),
        (3, 'Cédula de Extranjería', 'CE', 'M'),
        (4, 'Pasaporte', 'PAS', 'M'),
        (5, 'Tarjeta de Identidad', 'TI', 'M')
        SET IDENTITY_INSERT tipos_documento OFF
        PRINT 'Datos insertados en tipos_documento.'
      END
    `)

    // Insertar tipos de régimen tributario si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM tipos_regimen_tributario)
      BEGIN
        SET IDENTITY_INSERT tipos_regimen_tributario ON
        INSERT INTO tipos_regimen_tributario (id, nombre, descripcion, master_detail) VALUES 
        (1, 'Régimen Simple', 'Régimen de tributación simple', 'M'),
        (2, 'Régimen Ordinario', 'Régimen de tributación ordinario', 'M'),
        (3, 'Gran Contribuyente', 'Régimen de gran contribuyente', 'M'),
        (4, 'Responsable de IVA', 'Responsable de IVA', 'M'),
        (5, 'No Responsable de IVA', 'No responsable de IVA', 'M')
        SET IDENTITY_INSERT tipos_regimen_tributario OFF
        PRINT 'Datos insertados en tipos_regimen_tributario.'
      END
    `)

    // Insertar países si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM paises)
      BEGIN
        SET IDENTITY_INSERT paises ON
        INSERT INTO paises (id, nombre, codigo, master_detail) VALUES 
        (1, 'Colombia', 'CO', 'M'),
        (2, 'Estados Unidos', 'USA', 'M'),
        (3, 'España', 'ES', 'M'),
        (4, 'México', 'MX', 'M'),
        (5, 'Argentina', 'AR', 'M'),
        (6, 'Chile', 'CL', 'M'),
        (7, 'Perú', 'PE', 'M'),
        (8, 'Brasil', 'BR', 'M')
        SET IDENTITY_INSERT paises OFF
        PRINT 'Datos insertados en paises.'
      END
    `)

    // Insertar departamentos si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM departamentos)
      BEGIN
        SET IDENTITY_INSERT departamentos ON
        INSERT INTO departamentos (id, nombre, codigo, pais_id, master_detail) VALUES 
        (1, 'Cundinamarca', 'CUN', 1, 'M'),
        (2, 'Antioquia', 'ANT', 1, 'M'),
        (3, 'Valle del Cauca', 'VAL', 1, 'M'),
        (4, 'Atlántico', 'ATL', 1, 'M'),
        (5, 'Santander', 'SAN', 1, 'M'),
        (6, 'Bolívar', 'BOL', 1, 'M'),
        (7, 'Boyacá', 'BOY', 1, 'M'),
        (8, 'Caldas', 'CAL', 1, 'M')
        SET IDENTITY_INSERT departamentos OFF
        PRINT 'Datos insertados en departamentos.'
      END
    `)

    // Insertar ciudades si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM ciudades)
      BEGIN
        SET IDENTITY_INSERT ciudades ON
        INSERT INTO ciudades (id, nombre, codigo, departamento_id, master_detail) VALUES 
        (1, 'Bogotá D.C.', 'BOG', 1, 'M'),
        (2, 'Medellín', 'MED', 2, 'M'),
        (3, 'Cali', 'CAL', 3, 'M'),
        (4, 'Barranquilla', 'BAQ', 4, 'M'),
        (5, 'Bucaramanga', 'BUC', 5, 'M'),
        (6, 'Cartagena', 'CTG', 6, 'M'),
        (7, 'Tunja', 'TUN', 7, 'M'),
        (8, 'Manizales', 'MZL', 8, 'M'),
        (9, 'Soacha', 'SOA', 1, 'M'),
        (10, 'Zipaquirá', 'ZIP', 1, 'M'),
        (11, 'Bello', 'BEL', 2, 'M'),
        (12, 'Envigado', 'ENV', 2, 'M'),
        (13, 'Palmira', 'PAL', 3, 'M'),
        (14, 'Buenaventura', 'BVN', 3, 'M'),
        (15, 'Soledad', 'SOL', 4, 'M')
        SET IDENTITY_INSERT ciudades OFF
        PRINT 'Datos insertados en ciudades.'
      END
    `)

    // Insertar códigos CIIU si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM codigos_ciiu)
      BEGIN
        SET IDENTITY_INSERT codigos_ciiu ON
        INSERT INTO codigos_ciiu (id, codigo, descripcion, master_detail) VALUES 
        (1, '6201', 'Desarrollo de sistemas informáticos', 'M'),
        (2, '6202', 'Consultoría informática', 'M'),
        (3, '7020', 'Actividades de consultoría de gestión', 'M'),
        (4, '4651', 'Comercio al por mayor de computadores y equipos periféricos', 'M'),
        (5, '6209', 'Otras actividades de tecnología de información', 'M'),
        (6, '6311', 'Procesamiento de datos, alojamiento (hosting)', 'M'),
        (7, '6312', 'Portales web', 'M'),
        (8, '4741', 'Comercio al por menor de computadores y equipos', 'M')
        SET IDENTITY_INSERT codigos_ciiu OFF
        PRINT 'Datos insertados en codigos_ciiu.'
      END
    `)

    // Insertar actividades comerciales si no existen
    await pool.request().query(`
      IF NOT EXISTS (SELECT TOP 1 1 FROM actividades_comerciales)
      BEGIN
        SET IDENTITY_INSERT actividades_comerciales ON
        INSERT INTO actividades_comerciales (id, nombre, descripcion, master_detail) VALUES 
        (1, 'Desarrollo de Software', 'Desarrollo de aplicaciones y sistemas', 'M'),
        (2, 'Consultoría TI', 'Servicios de consultoría en tecnología', 'M'),
        (3, 'Servicios Profesionales', 'Prestación de servicios profesionales', 'M'),
        (4, 'Comercio Tecnología', 'Venta de equipos y software', 'M'),
        (5, 'Soporte Técnico', 'Servicios de soporte y mantenimiento', 'M'),
        (6, 'Hosting y Cloud', 'Servicios de alojamiento y nube', 'M'),
        (7, 'Desarrollo Web', 'Desarrollo de sitios y aplicaciones web', 'M'),
        (8, 'Marketing Digital', 'Servicios de marketing y publicidad digital', 'M')
        SET IDENTITY_INSERT actividades_comerciales OFF
        PRINT 'Datos insertados en actividades_comerciales.'
      END
    `)

    console.log('✅ Todos los datos de prueba han sido insertados correctamente')
    
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error)
    throw error
  }
}
