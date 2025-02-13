
import { serve } from "https://deno.fresh.run/std@0.204.0/http/server.ts"
import { sql } from 'npm:mssql@10.0.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Recibiendo petición:', req.method)
    const body = await req.json()
    console.log('Datos recibidos:', JSON.stringify(body))

    const { action, data } = body

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

    const config = {
      user: data.username,
      password: data.password,
      database: data.database,
      server: data.server,
      port: parseInt(data.port),
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    }

    console.log('Intentando conectar a:', data.server)
    
    // Conectar a SQL Server
    await sql.connect(config)
    console.log('Conexión establecida exitosamente')

    let result

    switch (action) {
      case 'getTableStats':
        console.log('Ejecutando consulta getTableStats')
        result = await sql.query`
          SELECT 
            t.name AS table_name,
            p.rows AS row_count,
            (SUM(a.used_pages) * 8.0 / 1024) AS size_in_kb
          FROM sys.tables t
          INNER JOIN sys.indexes i ON t.object_id = i.object_id
          INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
          INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
          GROUP BY t.name, p.rows
          ORDER BY t.name;
        `
        break

      default:
        throw new Error('Acción no válida: ' + action)
    }

    await sql.close()
    console.log('Conexión cerrada exitosamente')

    return new Response(
      JSON.stringify({ success: true, data: result.recordset || result }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error en la función edge:', error)
    
    // Asegurarse de cerrar la conexión en caso de error
    try {
      await sql.close()
    } catch (closeError) {
      console.error('Error al cerrar la conexión:', closeError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error interno del servidor',
        details: error.toString()
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
