
import { serve } from "https://deno.fresh.run/std@0.204.0/http/server.ts"
import { sql } from 'npm:mssql@10.0.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()

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

    // Conectar a SQL Server
    await sql.connect(config)

    let result

    switch (action) {
      case 'getTableStats':
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
        throw new Error('Acción no válida')
    }

    await sql.close()

    return new Response(
      JSON.stringify({ success: true, data: result.recordset || result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
