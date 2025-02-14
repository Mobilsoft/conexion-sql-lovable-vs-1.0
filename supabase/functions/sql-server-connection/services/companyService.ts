import mssql from "npm:mssql@9.1.1"

export const insertCompany = async (pool: mssql.ConnectionPool, company: any) => {
  console.log('Insertando nueva compañía:', company)
  
  const result = await pool.request()
    .input('nit', mssql.VarChar, company.nit)
    .input('dv', mssql.VarChar, company.dv)
    .input('razon_social', mssql.VarChar, company.razon_social)
    .input('tipo_documento_id', mssql.Int, company.tipo_documento_id)
    .input('tipo_contribuyente', mssql.VarChar, company.tipo_contribuyente)
    .input('direccion', mssql.VarChar, company.direccion)
    .input('direccion_principal', mssql.VarChar, company.direccion_principal)
    .input('telefono', mssql.VarChar, company.telefono)
    .input('telefono_movil', mssql.VarChar, company.telefono_movil)
    .input('email', mssql.VarChar, company.email)
    .input('correo_electronico', mssql.VarChar, company.correo_electronico)
    .input('departamento_id', mssql.Int, company.departamento_id)
    .input('departamento', mssql.VarChar, company.departamento)
    .input('ciudad_id', mssql.Int, company.ciudad_id)
    .input('ciudad', mssql.VarChar, company.ciudad)
    .input('pais_id', mssql.Int, company.pais_id)
    .input('codigo_ciiu_id', mssql.Int, company.codigo_ciiu_id)
    .input('actividad_comercial_id', mssql.Int, company.actividad_comercial_id)
    .input('tipo_regimen_id', mssql.Int, company.tipo_regimen_id)
    .input('municipio', mssql.VarChar, company.municipio)
    .input('master_detail', mssql.VarChar, 'M')
    .query(`
      INSERT INTO companies (
        nit, dv, razon_social, tipo_documento_id, tipo_contribuyente,
        direccion, direccion_principal, telefono, telefono_movil,
        email, correo_electronico, departamento_id, departamento,
        ciudad_id, ciudad, pais_id, codigo_ciiu_id,
        actividad_comercial_id, tipo_regimen_id, municipio, master_detail
      )
      VALUES (
        @nit, @dv, @razon_social, @tipo_documento_id, @tipo_contribuyente,
        @direccion, @direccion_principal, @telefono, @telefono_movil,
        @email, @correo_electronico, @departamento_id, @departamento,
        @ciudad_id, @ciudad, @pais_id, @codigo_ciiu_id,
        @actividad_comercial_id, @tipo_regimen_id, @municipio, @master_detail
      )
    `)

  return result
}

export const updateCompany = async (pool: mssql.ConnectionPool, company: any) => {
  console.log('Actualizando compañía:', company)
  
  const result = await pool.request()
    .input('nit', mssql.VarChar, company.nit)
    .input('dv', mssql.VarChar, company.dv)
    .input('razon_social', mssql.VarChar, company.razon_social)
    .input('tipo_documento_id', mssql.Int, company.tipo_documento_id)
    .input('tipo_contribuyente', mssql.VarChar, company.tipo_contribuyente)
    .input('direccion', mssql.VarChar, company.direccion)
    .input('direccion_principal', mssql.VarChar, company.direccion_principal)
    .input('telefono', mssql.VarChar, company.telefono)
    .input('telefono_movil', mssql.VarChar, company.telefono_movil)
    .input('email', mssql.VarChar, company.email)
    .input('correo_electronico', mssql.VarChar, company.correo_electronico)
    .input('departamento_id', mssql.Int, company.departamento_id)
    .input('departamento', mssql.VarChar, company.departamento)
    .input('ciudad_id', mssql.Int, company.ciudad_id)
    .input('ciudad', mssql.VarChar, company.ciudad)
    .input('pais_id', mssql.Int, company.pais_id)
    .input('codigo_ciiu_id', mssql.Int, company.codigo_ciiu_id)
    .input('actividad_comercial_id', mssql.Int, company.actividad_comercial_id)
    .input('tipo_regimen_id', mssql.Int, company.tipo_regimen_id)
    .input('municipio', mssql.VarChar, company.municipio)
    .query(`
      UPDATE companies
      SET 
        dv = @dv,
        razon_social = @razon_social,
        tipo_documento_id = @tipo_documento_id,
        tipo_contribuyente = @tipo_contribuyente,
        direccion = @direccion,
        direccion_principal = @direccion_principal,
        telefono = @telefono,
        telefono_movil = @telefono_movil,
        email = @email,
        correo_electronico = @correo_electronico,
        departamento_id = @departamento_id,
        departamento = @departamento,
        ciudad_id = @ciudad_id,
        ciudad = @ciudad,
        pais_id = @pais_id,
        codigo_ciiu_id = @codigo_ciiu_id,
        actividad_comercial_id = @actividad_comercial_id,
        tipo_regimen_id = @tipo_regimen_id,
        municipio = @municipio
      WHERE nit = @nit
    `)

  return result
}

export const deleteCompany = async (pool: mssql.ConnectionPool, nit: string) => {
  console.log('Eliminando compañía con NIT:', nit);
  return await pool.request()
    .input('nit', mssql.VarChar, nit)
    .query(`
      DELETE FROM companies 
      WHERE nit = @nit
    `);
}

export const getCompanies = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo lista de compañías...');
  return await pool.request().query(`
    SELECT * FROM companies 
    WHERE master_detail = 'M' 
    ORDER BY fecha_creacion DESC
  `);
}

export const getCodigosCIIU = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo códigos CIIU...');
  return await pool.request().query(`
    SELECT id, codigo, descripcion 
    FROM codigos_ciiu 
    WHERE master_detail = 'M' 
    ORDER BY codigo
  `);
}

export const getActividadesComerciales = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo actividades comerciales...');
  return await pool.request().query(`
    SELECT id, nombre, descripcion 
    FROM actividades_comerciales 
    WHERE master_detail = 'M' 
    ORDER BY nombre
  `);
}

export const getTiposRegimen = async (pool: mssql.ConnectionPool) => {
  console.log('Obteniendo tipos de régimen...');
  return await pool.request().query(`
    SELECT id, nombre, descripcion 
    FROM tipos_regimen_tributario 
    WHERE master_detail = 'M' 
    ORDER BY nombre
  `);
}
