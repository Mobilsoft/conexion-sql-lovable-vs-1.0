
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import mssql from "npm:mssql@9.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// Creamos un pool global para reutilizar la conexión
let globalPool: mssql.ConnectionPool | null = null;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    })
  }
  
  try {
    const body = await req.json()
    console.log('Datos recibidos:', JSON.stringify(body, (key, value) => 
      key === 'password' ? '***' : value
    ))

    const { action, data } = body

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

    // Si no hay un pool global o está cerrado, creamos uno nuevo
    if (!globalPool) {
      console.log('Configurando nueva conexión...')
      console.log('Intentando conectar a:', data.server, 'puerto:', data.port)

      const config = {
        user: data.username,
        password: data.password,
        database: data.database,
        server: data.server,
        port: parseInt(data.port),
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true
        },
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 300000 // Aumentamos el tiempo de inactividad a 5 minutos
        },
        connectionTimeout: 15000,
        requestTimeout: 15000
      }

      console.log('Iniciando conexión a SQL Server...')
      globalPool = await new mssql.ConnectionPool(config).connect()
      console.log('Conexión establecida exitosamente')
    }

    let result

    switch (action) {
      case 'getTableStats':
        console.log('Ejecutando consulta getTableStats')
        result = await globalPool.request().query(`
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
        console.log('Consulta ejecutada exitosamente:', JSON.stringify(result?.recordset))
        break

      case 'getTableStructure':
        console.log('Obteniendo estructura de tabla:', data.tableName)
        // Primero verificamos si la columna master_detail existe
        const columnExists = await globalPool.request()
          .input('tableName', mssql.VarChar, data.tableName)
          .query(`
            SELECT COUNT(*) as exists_count
            FROM sys.columns c
            WHERE c.object_id = OBJECT_ID(@tableName)
            AND c.name = 'master_detail'
          `)

        // Si la columna no existe, la agregamos
        if (columnExists.recordset[0].exists_count === 0) {
          console.log('Agregando columna master_detail...')
          await globalPool.request()
            .input('tableName', mssql.VarChar, data.tableName)
            .query(`
              ALTER TABLE ${data.tableName}
              ADD master_detail char(1) DEFAULT 'M'
            `)
          console.log('Columna master_detail agregada exitosamente')
        }

        // Ahora obtenemos la estructura actualizada
        result = await globalPool.request()
          .input('tableName', mssql.VarChar, data.tableName)
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
        console.log('Estructura de tabla obtenida exitosamente:', JSON.stringify(result?.recordset))
        break

      default:
        throw new Error('Acción no válida: ' + action)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result?.recordset || [] 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    
    // Si hay un error de conexión, limpiamos el pool global
    if (error instanceof Error && error.message.includes('connection')) {
      globalPool = null;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
