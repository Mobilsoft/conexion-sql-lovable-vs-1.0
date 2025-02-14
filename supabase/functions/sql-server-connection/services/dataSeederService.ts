import { Connection } from 'npm:mssql@9.1.1';
import { getConnection, clearConnection } from '../db/connection.ts';

export async function seedTestData(connection: Connection): Promise<void> {
  const seedQueries = [
    // Tipos de documento
    `IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT tipos_documento ON
        INSERT INTO tipos_documento (id, nombre, codigo, master_detail) VALUES 
        (1, 'Cédula de Ciudadanía', 'CC', 'M'),
        (2, 'NIT', 'NIT', 'M'),
        (3, 'Cédula de Extranjería', 'CE', 'M'),
        (4, 'Pasaporte', 'PAS', 'M'),
        (5, 'Tarjeta de Identidad', 'TI', 'M')
        SET IDENTITY_INSERT tipos_documento OFF
    END`,
    // Códigos CIIU
    `IF NOT EXISTS (SELECT 1 FROM codigos_ciiu WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT codigos_ciiu ON
        INSERT INTO codigos_ciiu (id, codigo, descripcion, master_detail) VALUES
        (1, '6201', 'Actividades de programación informática', 'M'),
        (2, '6202', 'Actividades de consultoría informática', 'M'),
        (3, '6209', 'Otras actividades de tecnologías de la información y la informática', 'M'),
        (4, '6311', 'Procesamiento de datos, alojamiento (hosting) y actividades relacionadas', 'M'),
        (5, '6312', 'Portales web', 'M')
        SET IDENTITY_INSERT codigos_ciiu OFF
    END`,
    // Actividades comerciales
    `IF NOT EXISTS (SELECT 1 FROM actividades_comerciales WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT actividades_comerciales ON
        INSERT INTO actividades_comerciales (id, nombre, descripcion, master_detail) VALUES
        (1, 'Desarrollo de software a la medida', 'Desarrollo de software adaptado a las necesidades del cliente', 'M'),
        (2, 'Consultoría en TI', 'Asesoramiento en tecnologías de la información', 'M'),
        (3, 'Servicios de hosting', 'Alojamiento de sitios web y aplicaciones', 'M'),
        (4, 'Creación de portales web', 'Diseño y desarrollo de portales web', 'M'),
        (5, 'Soporte técnico informático', 'Asistencia técnica para equipos y sistemas informáticos', 'M')
        SET IDENTITY_INSERT actividades_comerciales OFF
    END`,
    // Tipos de régimen tributario
    `IF NOT EXISTS (SELECT 1 FROM tipos_regimen_tributario WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT tipos_regimen_tributario ON
        INSERT INTO tipos_regimen_tributario (id, nombre, descripcion, master_detail) VALUES
        (1, 'Ordinario', 'Régimen general de tributación', 'M'),
        (2, 'Simple', 'Régimen simplificado para pequeñas empresas', 'M')
        SET IDENTITY_INSERT tipos_regimen_tributario OFF
    END`,
    // Departamentos
    `IF NOT EXISTS (SELECT 1 FROM departamentos WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT departamentos ON
        INSERT INTO departamentos (id, nombre, codigo, pais_id, master_detail) VALUES
        (1, 'Antioquia', '05', 1, 'M'),
        (2, 'Atlántico', '08', 1, 'M'),
        (3, 'Bogotá', '11', 1, 'M'),
        (4, 'Valle del Cauca', '76', 1, 'M')
        SET IDENTITY_INSERT departamentos OFF
    END`,
    // Ciudades
    `IF NOT EXISTS (SELECT 1 FROM ciudades WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT ciudades ON
        INSERT INTO ciudades (id, nombre, codigo, departamento_id, master_detail) VALUES
        (1, 'Medellín', '001', 1, 'M'),
        (2, 'Barranquilla', '001', 2, 'M'),
        (3, 'Bogotá', '001', 3, 'M'),
        (4, 'Cali', '001', 4, 'M')
        SET IDENTITY_INSERT ciudades OFF
    END`
  ];

  try {
    for (const query of seedQueries) {
      await connection.request().query(query);
    }
  } catch (error) {
    console.error('Error ejecutando queries:', error);
    throw error;
  }
}

export async function handleSeedData(connectionConfig: any) {
  let connection: Connection | null = null;
  try {
    console.log('🔄 Iniciando proceso de seeding...');
    connection = await getConnection(connectionConfig);
    
    if (!connection) {
      throw new Error('No se pudo establecer la conexión');
    }

    await seedTestData(connection);
    console.log('✅ Datos de prueba insertados correctamente');
    
    return { 
      success: true, 
      message: 'Datos de prueba insertados correctamente' 
    };

  } catch (error: any) {
    console.error('❌ Error en el proceso de seeding:', error);
    return { 
      success: false, 
      error: error.message || 'Error desconocido durante el seeding'
    };
  } finally {
    if (connection) {
      console.log('🔌 Limpiando conexión...');
      await clearConnection();
    }
  }
}
