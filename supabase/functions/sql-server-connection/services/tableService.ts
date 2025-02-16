import mssql from "npm:mssql@9.1.1"

export const getTableStats = async (pool: mssql.ConnectionPool) => {
  const tables = await pool.request().query(`
    SELECT name 
    FROM sys.tables 
    WHERE is_ms_shipped = 0
    ORDER BY name;
  `)

  // Verificar y agregar master_detail a todas las tablas
  for (const table of tables.recordset) {
    await ensureMasterDetailColumn(pool, table.name)
  }

  // Obtener estadísticas
  return await pool.request().query(`
    WITH TableSpaceUsage AS (
      SELECT 
        t.object_id,
        ROUND(
          (SUM(a.total_pages) * 8.0) / 1024, 2
        ) AS size_in_kb
      FROM sys.tables t
      INNER JOIN sys.indexes i ON t.object_id = i.object_id
      INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
      INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
      GROUP BY t.object_id
    )
    SELECT 
      t.name AS table_name,
      SUM(p.rows) AS row_count,
      tsu.size_in_kb
    FROM sys.tables t
    INNER JOIN sys.partitions p ON t.object_id = p.object_id
    INNER JOIN TableSpaceUsage tsu ON t.object_id = tsu.object_id
    WHERE t.is_ms_shipped = 0
    GROUP BY t.name, tsu.size_in_kb
    ORDER BY t.name;
  `)
}

export const getTableStructure = async (pool: mssql.ConnectionPool, tableName: string) => {
  // Asegurar que existe la columna master_detail
  await ensureMasterDetailColumn(pool, tableName)

  // Obtener estructura
  return await pool.request()
    .input('tableName', mssql.VarChar, tableName)
    .query(`
      SELECT 
        c.name AS column_name,
        t.name AS data_type,
        c.is_nullable,
        OBJECT_DEFINITION(c.default_object_id) as column_default,
        c.max_length,
        c.precision,
        c.scale,
        CASE 
          WHEN pk.column_id IS NOT NULL THEN 1
          ELSE 0
        END AS is_primary_key,
        CASE 
          WHEN fk.parent_column_id IS NOT NULL THEN 1
          ELSE 0
        END AS is_foreign_key,
        OBJECT_SCHEMA_NAME(c.object_id) as schema_name,
        c.collation_name,
        CASE 
          WHEN c.name = 'master_detail' THEN 1
          ELSE 0
        END AS is_master_detail
      FROM sys.columns c
      INNER JOIN sys.types t 
        ON c.user_type_id = t.user_type_id
      LEFT JOIN sys.index_columns pk 
        ON pk.object_id = c.object_id 
        AND pk.column_id = c.column_id 
        AND pk.index_id = 1
      LEFT JOIN sys.foreign_key_columns fk 
        ON fk.parent_object_id = c.object_id 
        AND fk.parent_column_id = c.column_id
      WHERE c.object_id = OBJECT_ID(@tableName)
      ORDER BY c.column_id;
    `)
}

export const insertCompany = async (pool: mssql.ConnectionPool, companyData: any) => {
  console.log('Insertando nueva compañía:', companyData)
  
  const result = await pool.request()
    .input('nit', mssql.VarChar, companyData.nit)
    .input('dv', mssql.VarChar, companyData.dv)
    .input('razon_social', mssql.VarChar, companyData.razon_social)
    .input('tipo_documento_id', mssql.Int, companyData.tipo_documento_id)
    .input('tipo_contribuyente', mssql.VarChar, companyData.tipo_contribuyente)
    .input('direccion', mssql.VarChar, companyData.direccion)
    .input('direccion_principal', mssql.VarChar, companyData.direccion_principal)
    .input('telefono', mssql.VarChar, companyData.telefono)
    .input('telefono_movil', mssql.VarChar, companyData.telefono_movil)
    .input('email', mssql.VarChar, companyData.email)
    .input('correo_electronico', mssql.VarChar, companyData.correo_electronico)
    .input('departamento_id', mssql.Int, companyData.departamento_id)
    .input('departamento', mssql.VarChar, companyData.departamento)
    .input('ciudad_id', mssql.Int, companyData.ciudad_id)
    .input('ciudad', mssql.VarChar, companyData.ciudad)
    .input('pais_id', mssql.Int, companyData.pais_id)
    .input('codigo_ciiu_id', mssql.Int, companyData.codigo_ciiu_id)
    .input('actividad_comercial_id', mssql.Int, companyData.actividad_comercial_id)
    .input('tipo_regimen_id', mssql.Int, companyData.tipo_regimen_id)
    .input('municipio', mssql.VarChar, companyData.municipio)
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

export const updateCompany = async (pool: mssql.ConnectionPool, companyData: any) => {
  console.log('Actualizando compañía:', companyData)
  
  const result = await pool.request()
    .input('nit', mssql.VarChar, companyData.nit)
    .input('dv', mssql.VarChar, companyData.dv)
    .input('razon_social', mssql.VarChar, companyData.razon_social)
    .input('tipo_documento_id', mssql.Int, companyData.tipo_documento_id)
    .input('tipo_contribuyente', mssql.VarChar, companyData.tipo_contribuyente)
    .input('direccion', mssql.VarChar, companyData.direccion)
    .input('direccion_principal', mssql.VarChar, companyData.direccion_principal)
    .input('telefono', mssql.VarChar, companyData.telefono)
    .input('telefono_movil', mssql.VarChar, companyData.telefono_movil)
    .input('email', mssql.VarChar, companyData.email)
    .input('correo_electronico', mssql.VarChar, companyData.correo_electronico)
    .input('departamento_id', mssql.Int, companyData.departamento_id)
    .input('departamento', mssql.VarChar, companyData.departamento)
    .input('ciudad_id', mssql.Int, companyData.ciudad_id)
    .input('ciudad', mssql.VarChar, companyData.ciudad)
    .input('pais_id', mssql.Int, companyData.pais_id)
    .input('codigo_ciiu_id', mssql.Int, companyData.codigo_ciiu_id)
    .input('actividad_comercial_id', mssql.Int, companyData.actividad_comercial_id)
    .input('tipo_regimen_id', mssql.Int, companyData.tipo_regimen_id)
    .input('municipio', mssql.VarChar, companyData.municipio)
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

export const insertData = async (pool: mssql.ConnectionPool, tableName: string, data: any) => {
  console.log('Insertando datos en la tabla:', tableName, 'Datos:', data);

  // Construir la consulta dinámicamente
  const columns = Object.keys(data);
  const values = Object.values(data);
  const params = columns.map((_, i) => `@p${i}`);

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${params.join(', ')})
  `;

  const request = pool.request();
  
  // Agregar parámetros dinámicamente
  values.forEach((value, index) => {
    request.input(`p${index}`, value);
  });

  console.log('Query a ejecutar:', query);
  return await request.query(query);
};

const ensureMasterDetailColumn = async (pool: mssql.ConnectionPool, tableName: string) => {
  console.log('Verificando tabla:', tableName)
  
  const columnExists = await pool.request()
    .input('tableName', mssql.VarChar, tableName)
    .query(`
      SELECT COUNT(*) as exists_count
      FROM sys.columns c
      WHERE c.object_id = OBJECT_ID(@tableName)
      AND c.name = 'master_detail'
    `)

  if (columnExists.recordset[0].exists_count === 0) {
    console.log('Agregando columna master_detail a la tabla:', tableName)
    await pool.request()
      .input('tableName', mssql.VarChar, tableName)
      .query(`
        ALTER TABLE ${tableName}
        ADD master_detail char(1) DEFAULT 'M'
      `)
    console.log('Columna master_detail agregada exitosamente a:', tableName)
  }
}
