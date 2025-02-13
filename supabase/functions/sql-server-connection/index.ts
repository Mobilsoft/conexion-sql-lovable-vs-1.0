
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import * as mssql from "npm:mssql@7.2.1"

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

    const config = {
      user: data.username,
      password: data.password,
      database: data.database,
      server: data.server,
      port: parseInt(data.port),
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    }

    let pool: mssql.ConnectionPool | null = null

    try {
      console.log('Conectando a SQL Server...')
      pool = await mssql.connect(config)
      console.log('Conexión establecida')

      let result

      switch (action) {
        case 'getTableStats':
          console.log('Ejecutando consulta getTableStats')
          result = await pool.request().query(`
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
          `)
          console.log('Consulta ejecutada exitosamente')
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

    } finally {
      if (pool) {
        console.log('Cerrando conexión...')
        await pool.close()
        console.log('Conexión cerrada')
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
