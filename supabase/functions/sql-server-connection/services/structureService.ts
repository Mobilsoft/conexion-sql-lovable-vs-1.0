
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

export const ensureMasterDetailColumn = async (pool: mssql.ConnectionPool, tableName: string) => {
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
