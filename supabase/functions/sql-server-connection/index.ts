
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import mssql from "npm:mssql@9.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

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

    console.log('Configurando conexión...')
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
        idleTimeoutMillis: 30000
      },
      connectionTimeout: 15000,
      requestTimeout: 15000
    }

    try {
      console.log('Iniciando conexión a SQL Server...')
      const pool = await mssql.connect(config)
      console.log('Conexión establecida exitosamente')

      let result

      switch (action) {
        case 'getTableStats':
          console.log('Ejecutando consulta getTableStats')
          result = await pool.request().query(`
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
          console.log('Consulta ejecutada exitosamente')
          break

        case 'getTableStructure':
          console.log('Obteniendo estructura de tabla:', data.tableName)
          result = await pool.request()
            .input('tableName', mssql.VarChar, data.tableName)
            .query(`
              SELECT 
                c.name AS column_name,
                t.name AS data_type,
                c.is_nullable,
                OBJECT_DEFINITION(c.default_object_id) as column_default,
                c.max_length,
                c.precision,
                c.scale
              FROM sys.columns c
              INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
              WHERE object_id = OBJECT_ID(@tableName)
              ORDER BY c.column_id;
            `)
          console.log('Estructura de tabla obtenida exitosamente')
          break

        default:
          throw new Error('Acción no válida: ' + action)
      }

      await pool.close()

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

    } catch (dbError) {
      console.error('Error de conexión detallado:', {
        message: dbError instanceof Error ? dbError.message : 'Error desconocido',
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      
      // Comprobar si el error es específico de red o conexión
      const errorMessage = dbError instanceof Error ? dbError.message : 'Error desconocido';
      if (errorMessage.includes('timeout') || errorMessage.includes('Failed to connect')) {
        throw new Error(`No se pudo establecer conexión con el servidor SQL Server. 
          Por favor, verifique que:
          1. El servidor esté en línea y accesible
          2. El puerto 1433 esté abierto y permitido por el firewall
          3. Las credenciales sean correctas`);
      }
      
      throw new Error(
        dbError instanceof Error 
          ? `Error de conexión a SQL Server: ${dbError.message}`
          : 'Error desconocido al conectar a SQL Server'
      )
    } finally {
      try {
        console.log('Cerrando conexión...')
        await mssql.close()
        console.log('Conexión cerrada')
      } catch (closeError) {
        console.error('Error al cerrar la conexión:', closeError)
      }
    }

  } catch (error) {
    console.error('Error:', error)
    
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
