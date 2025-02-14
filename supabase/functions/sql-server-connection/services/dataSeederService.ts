
import { Connection, Request } from 'tedious';
import { getConnection } from '../db/connection';

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

    // Tipos de régimen tributario
    `IF NOT EXISTS (SELECT 1 FROM tipos_regimen_tributario WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT tipos_regimen_tributario ON
        INSERT INTO tipos_regimen_tributario (id, nombre, descripcion, master_detail) VALUES 
        (1, 'Régimen Simple', 'Régimen de tributación simple', 'M'),
        (2, 'Régimen Ordinario', 'Régimen de tributación ordinario', 'M'),
        (3, 'Gran Contribuyente', 'Régimen de gran contribuyente', 'M'),
        (4, 'Responsable de IVA', 'Responsable de IVA', 'M'),
        (5, 'No Responsable de IVA', 'No responsable de IVA', 'M')
        SET IDENTITY_INSERT tipos_regimen_tributario OFF
    END`,

    // Países
    `IF NOT EXISTS (SELECT 1 FROM paises WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT paises ON
        INSERT INTO paises (id, nombre, codigo, master_detail) VALUES 
        (1, 'Colombia', 'CO', 'M'),
        (2, 'Estados Unidos', 'USA', 'M'),
        (3, 'España', 'ES', 'M'),
        (4, 'México', 'MX', 'M'),
        (5, 'Argentina', 'AR', 'M')
        SET IDENTITY_INSERT paises OFF
    END`,

    // Departamentos
    `IF NOT EXISTS (SELECT 1 FROM departamentos WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT departamentos ON
        INSERT INTO departamentos (id, nombre, codigo, pais_id, master_detail) VALUES 
        (1, 'Cundinamarca', 'CUN', 1, 'M'),
        (2, 'Antioquia', 'ANT', 1, 'M'),
        (3, 'Valle del Cauca', 'VAL', 1, 'M'),
        (4, 'Atlántico', 'ATL', 1, 'M'),
        (5, 'Santander', 'SAN', 1, 'M')
        SET IDENTITY_INSERT departamentos OFF
    END`,

    // Ciudades
    `IF NOT EXISTS (SELECT 1 FROM ciudades WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT ciudades ON
        INSERT INTO ciudades (id, nombre, codigo, departamento_id, master_detail) VALUES 
        (1, 'Bogotá D.C.', 'BOG', 1, 'M'),
        (2, 'Medellín', 'MED', 2, 'M'),
        (3, 'Cali', 'CAL', 3, 'M'),
        (4, 'Barranquilla', 'BAQ', 4, 'M'),
        (5, 'Bucaramanga', 'BUC', 5, 'M'),
        (6, 'Soacha', 'SOA', 1, 'M'),
        (7, 'Bello', 'BEL', 2, 'M'),
        (8, 'Palmira', 'PAL', 3, 'M'),
        (9, 'Soledad', 'SOL', 4, 'M'),
        (10, 'Girón', 'GIR', 5, 'M')
        SET IDENTITY_INSERT ciudades OFF
    END`,

    // Códigos CIIU
    `IF NOT EXISTS (SELECT 1 FROM codigos_ciiu WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT codigos_ciiu ON
        INSERT INTO codigos_ciiu (id, codigo, descripcion, master_detail) VALUES 
        (1, '6201', 'Desarrollo de sistemas informáticos', 'M'),
        (2, '6202', 'Consultoría informática', 'M'),
        (3, '7020', 'Actividades de consultoría de gestión', 'M'),
        (4, '4651', 'Comercio al por mayor de computadores', 'M'),
        (5, '6209', 'Otras actividades de tecnología', 'M')
        SET IDENTITY_INSERT codigos_ciiu OFF
    END`,

    // Actividades comerciales
    `IF NOT EXISTS (SELECT 1 FROM actividades_comerciales WHERE id = 1)
    BEGIN
        SET IDENTITY_INSERT actividades_comerciales ON
        INSERT INTO actividades_comerciales (id, nombre, descripcion, master_detail) VALUES 
        (1, 'Desarrollo de Software', 'Desarrollo de aplicaciones y sistemas', 'M'),
        (2, 'Consultoría TI', 'Servicios de consultoría en tecnología', 'M'),
        (3, 'Servicios Profesionales', 'Prestación de servicios profesionales', 'M'),
        (4, 'Comercio Tecnología', 'Venta de equipos y software', 'M'),
        (5, 'Soporte Técnico', 'Servicios de soporte y mantenimiento', 'M')
        SET IDENTITY_INSERT actividades_comerciales OFF
    END`
  ];

  for (const query of seedQueries) {
    await new Promise<void>((resolve, reject) => {
      const request = new Request(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });

      connection.execSql(request);
    });
  }
}

export async function handleSeedData(connectionConfig: any) {
  let connection: Connection | null = null;
  try {
    connection = await getConnection(connectionConfig);
    await seedTestData(connection);
    return { success: true, message: 'Datos de prueba insertados correctamente' };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
