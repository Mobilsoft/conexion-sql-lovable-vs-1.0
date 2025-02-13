
import mssql from "npm:mssql@9.1.1"

export const getCiudades = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de ciudades...');
  return await pool.request().query(`
    SELECT * FROM ciudades 
    WHERE master_detail = 'M' 
    ORDER BY nombre ASC
  `);
}

export const getDepartamentos = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de departamentos...');
  return await pool.request().query(`
    SELECT * FROM departamentos 
    WHERE master_detail = 'M' 
    ORDER BY nombre ASC
  `);
}
