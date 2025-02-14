
import mssql from "npm:mssql@9.1.1"

export const getCiudades = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de ciudades...');
  return await pool.request().query(`
    SELECT c.id, c.nombre, c.codigo, c.departamento_id,
           d.nombre as departamento_nombre,
           p.id as pais_id, p.nombre as pais_nombre
    FROM ciudades c
    LEFT JOIN departamentos d ON c.departamento_id = d.id
    LEFT JOIN paises p ON d.pais_id = p.id
    WHERE c.master_detail = 'M' 
    ORDER BY c.nombre ASC
  `);
}

export const getDepartamentos = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de departamentos...');
  return await pool.request().query(`
    SELECT d.id, d.nombre, d.codigo, d.pais_id,
           p.nombre as pais_nombre
    FROM departamentos d
    LEFT JOIN paises p ON d.pais_id = p.id
    WHERE d.master_detail = 'M' 
    ORDER BY d.nombre ASC
  `);
}

export const getPaises = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de países...');
  return await pool.request().query(`
    SELECT id, nombre, codigo
    FROM paises
    WHERE master_detail = 'M'
    ORDER BY nombre ASC
  `);
}
