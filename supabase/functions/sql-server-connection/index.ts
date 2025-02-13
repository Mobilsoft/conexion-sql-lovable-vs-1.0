
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { corsHeaders, handleCors } from "./utils/cors.ts"
import { Connection, Request, TYPES } from "npm:tedious@15.1.0"
import { createClient } from 'npm:@supabase/supabase-js@2.1.0'

serve(async (req) => {
  console.log('👉 Iniciando procesamiento de solicitud:', new Date().toISOString())
  let connection: Connection | null = null;
  
  if (req.method === 'OPTIONS') {
    console.log('🔄 Solicitud OPTIONS - Respondiendo con headers CORS')
    return new Response(null, handleCors())
  }
  
  try {
    console.log('📥 Obteniendo cuerpo de la solicitud...')
    const { action, data } = await req.json()
    console.log('📦 Datos recibidos:', { action, data: { ...data, password: '***' } })

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

    const config = {
      server: data.server,
      authentication: {
        type: 'default',
        options: {
          userName: data.username,
          password: data.password
        }
      },
      options: {
        database: data.database,
        encrypt: true,
        trustServerCertificate: true,
        port: parseInt(data.port),
        connectTimeout: 60000, // Aumentado a 60 segundos
        requestTimeout: 60000, // Aumentado a 60 segundos
        rowCollectionOnRequestCompletion: true,
        useUTC: true
      }
    }

    // Primero intentamos conectar con la configuración proporcionada
    console.log('🔄 Intentando conectar a SQL Server...')
    connection = new Connection(config)

    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.error('⏰ Timeout de conexión alcanzado')
        if (connection) {
          connection.close();
        }
        reject(new Error('No se pudo establecer la conexión con el servidor SQL. Por favor, verifique las credenciales y que el servidor esté accesible.'))
      }, 60000) // Aumentado a 60 segundos

      connection.on('connect', (err) => {
        clearTimeout(timeoutId)
        if (err) {
          console.error('❌ Error de conexión:', err)
          reject(err)
        } else {
          console.log('✅ Conexión establecida exitosamente')
          resolve(true)
        }
      })

      connection.on('error', (err) => {
        console.error('❌ Error en la conexión:', err)
        reject(err)
      })

      connection.connect()
    })

    // Si la conexión fue exitosa y es getTableStats, guardamos la configuración
    if (action === 'getTableStats') {
      console.log('🔑 Guardando configuración en Supabase...')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Faltan variables de entorno de Supabase')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Insertamos o actualizamos la configuración
      const { error: upsertError } = await supabase
        .from('sql_connections')
        .upsert({
          server: data.server,
          port: data.port,
          database: data.database,
          username: data.username,
          password: data.password
        })

      if (upsertError) {
        console.error('❌ Error al guardar la configuración:', upsertError)
        throw upsertError
      }

      console.log('✅ Configuración guardada exitosamente')
    }

    let result;

    if (action === 'getTableStats') {
      result = await new Promise((resolve, reject) => {
        const request = new Request(
          `SELECT 
            t.name AS table_name,
            p.rows AS row_count,
            SUM(a.total_pages) * 8 AS size_in_kb
          FROM sys.tables t
          INNER JOIN sys.indexes i ON t.object_id = i.object_id
          INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
          INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
          WHERE t.is_ms_shipped = 0
          GROUP BY t.name, p.rows
          ORDER BY t.name;`,
          (err) => {
            if (err) {
              reject(err);
            }
          }
        );

        const tables: any[] = [];
        
        request.on('row', (columns) => {
          const table = {
            table_name: columns[0].value,
            row_count: columns[1].value,
            size_in_kb: columns[2].value
          };
          tables.push(table);
        });

        request.on('error', (err) => {
          console.error('❌ Error en la consulta:', err)
          reject(err)
        });

        request.on('requestCompleted', () => {
          resolve(tables);
        });

        connection.execSql(request);
      });
    }

    console.log('📤 Preparando respuesta exitosa...')
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error en el proceso:', error)
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
  } finally {
    // Asegurarnos de cerrar la conexión
    if (connection) {
      console.log('🔌 Cerrando conexión...')
      connection.close()
    }
  }
})
