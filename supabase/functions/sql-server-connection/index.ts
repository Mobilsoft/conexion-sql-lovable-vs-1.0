import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { corsHeaders, handleCors } from "./utils/cors.ts"
import { Connection, Request, TYPES } from "npm:tedious@15.1.0"
import { createClient } from 'npm:@supabase/supabase-js@2.1.0'

serve(async (req) => {
  console.log('👉 Iniciando procesamiento de solicitud:', new Date().toISOString())
  
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

    let config = {
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
        connectTimeout: 30000,
        requestTimeout: 30000
      }
    }

    // Solo para acciones que no sean getTableStats, usar la conexión guardada
    if (action !== 'getTableStats') {
      console.log('🔑 Obteniendo credenciales de Supabase...')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Faltan variables de entorno de Supabase')
      }

      console.log('🔌 Inicializando cliente Supabase...')
      const supabase = createClient(supabaseUrl, supabaseKey)

      console.log('🔍 Buscando configuración de conexión SQL...')
      const { data: connections, error: queryError } = await supabase
        .from('sql_connections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (queryError) {
        console.error('❌ Error al obtener conexión SQL:', queryError)
        throw queryError
      }
      if (!connections || connections.length === 0) {
        console.error('❌ No se encontraron conexiones SQL configuradas')
        throw new Error('No hay conexiones SQL configuradas')
      }

      const connectionConfig = connections[0]
      config = {
        server: connectionConfig.server,
        authentication: {
          type: 'default',
          options: {
            userName: connectionConfig.username,
            password: connectionConfig.password
          }
        },
        options: {
          database: connectionConfig.database,
          encrypt: true,
          trustServerCertificate: true,
          port: parseInt(connectionConfig.port),
          connectTimeout: 30000,
          requestTimeout: 30000
        }
      }
    }

    console.log('🔄 Intentando conectar a SQL Server...')
    const connection = new Connection(config)

    await new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        console.error('⏰ Timeout de conexión alcanzado')
        reject(new Error('Timeout de conexión'))
      }, 30000)

      connection.connect((err) => {
        clearTimeout(timeoutId)
        if (err) {
          console.error('❌ Error de conexión:', err)
          reject(err)
        } else {
          console.log('✅ Conexión establecida exitosamente')
          resolve(true)
        }
      })
    })

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

        request.on('requestCompleted', () => {
          resolve(tables);
        });

        connection.execSql(request);
      });
    } else if (action === 'insertCompany' || action === 'updateCompany') {
      const query = action === 'insertCompany'
        ? `INSERT INTO Companies (name, description) VALUES ('${data.name}', '${data.description}');`
        : `UPDATE Companies SET name = '${data.name}', description = '${data.description}' WHERE id = ${data.id};`

      result = await new Promise((resolve, reject) => {
        const request = new Request(
          query,
          (err) => {
            if (err) {
              reject(err);
            }
          }
        );

        request.on('requestCompleted', () => {
          resolve({ message: 'Compañía insertada/actualizada exitosamente' });
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
  }
})
