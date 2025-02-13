
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
    console.log('📦 Datos recibidos:', { action, data: JSON.stringify(data) })

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

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
    console.log('✅ Configuración de conexión encontrada:', {
      server: connectionConfig.server,
      port: connectionConfig.port,
      database: connectionConfig.database,
      username: connectionConfig.username
    })

    console.log('🔧 Configurando conexión SQL Server...')
    const config = {
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

    let result

    if (action === 'insertCompany') {
      console.log('📝 Iniciando inserción de compañía...')
      result = await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO companies (
            nit, dv, razon_social, tipo_documento_id, tipo_contribuyente,
            direccion, direccion_principal, telefono, telefono_movil,
            email, correo_electronico, departamento_id, departamento,
            ciudad_id, ciudad, pais_id, codigo_ciiu_id, actividad_comercial_id,
            tipo_regimen_id, municipio, master_detail, estado_empresa,
            naturaleza_empresa, tipo_empresa
          ) VALUES (
            @nit, @dv, @razon_social, @tipo_documento_id, @tipo_contribuyente,
            @direccion, @direccion_principal, @telefono, @telefono_movil,
            @email, @correo_electronico, @departamento_id, @departamento,
            @ciudad_id, @ciudad, @pais_id, @codigo_ciiu_id, @actividad_comercial_id,
            @tipo_regimen_id, @municipio, @master_detail, @estado_empresa,
            @naturaleza_empresa, @tipo_empresa
          )`

        console.log('🔧 Preparando consulta SQL...')
        const request = new Request(query, (err) => {
          if (err) {
            console.error('❌ Error en insert:', err)
            reject(err)
          } else {
            console.log('✅ Inserción completada exitosamente')
            resolve({ success: true })
          }
        })

        console.log('📝 Agregando parámetros a la consulta...')
        // Agregar parámetros con sus tipos correspondientes
        request.addParameter('nit', TYPES.VarChar, data.nit)
        request.addParameter('dv', TYPES.VarChar, data.dv)
        request.addParameter('razon_social', TYPES.VarChar, data.razon_social)
        request.addParameter('tipo_documento_id', TYPES.Int, parseInt(data.tipo_documento_id))
        request.addParameter('tipo_contribuyente', TYPES.VarChar, data.tipo_contribuyente)
        request.addParameter('direccion', TYPES.VarChar, data.direccion)
        request.addParameter('direccion_principal', TYPES.VarChar, data.direccion_principal)
        request.addParameter('telefono', TYPES.VarChar, data.telefono)
        request.addParameter('telefono_movil', TYPES.VarChar, data.telefono_movil)
        request.addParameter('email', TYPES.VarChar, data.email)
        request.addParameter('correo_electronico', TYPES.VarChar, data.correo_electronico)
        request.addParameter('departamento_id', TYPES.Int, parseInt(data.departamento_id))
        request.addParameter('departamento', TYPES.VarChar, data.departamento)
        request.addParameter('ciudad_id', TYPES.Int, parseInt(data.ciudad_id))
        request.addParameter('ciudad', TYPES.VarChar, data.ciudad)
        request.addParameter('pais_id', TYPES.Int, data.pais_id)
        request.addParameter('codigo_ciiu_id', TYPES.Int, parseInt(data.codigo_ciiu_id))
        request.addParameter('actividad_comercial_id', TYPES.Int, parseInt(data.actividad_comercial_id))
        request.addParameter('tipo_regimen_id', TYPES.Int, parseInt(data.tipo_regimen_id))
        request.addParameter('municipio', TYPES.VarChar, data.municipio)
        request.addParameter('master_detail', TYPES.Char, data.master_detail)
        request.addParameter('estado_empresa', TYPES.VarChar, data.estado_empresa)
        request.addParameter('naturaleza_empresa', TYPES.VarChar, data.naturaleza_empresa)
        request.addParameter('tipo_empresa', TYPES.VarChar, data.tipo_empresa)

        console.log('▶️ Ejecutando consulta SQL...')
        connection.execSql(request)
      })
    } else if (action === 'updateCompany') {
      console.log('📝 Iniciando actualización de compañía...')
      result = await new Promise((resolve, reject) => {
        const query = `
          UPDATE companies SET
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
            municipio = @municipio,
            estado_empresa = @estado_empresa,
            naturaleza_empresa = @naturaleza_empresa,
            tipo_empresa = @tipo_empresa
          WHERE nit = @nit`

        console.log('🔧 Preparando consulta SQL de actualización...')
        const request = new Request(query, (err) => {
          if (err) {
            console.error('❌ Error en update:', err)
            reject(err)
          } else {
            console.log('✅ Actualización completada exitosamente')
            resolve({ success: true })
          }
        })

        console.log('📝 Agregando parámetros a la consulta de actualización...')
        // Agregar parámetros con sus tipos correspondientes
        request.addParameter('nit', TYPES.VarChar, data.nit)
        request.addParameter('dv', TYPES.VarChar, data.dv)
        request.addParameter('razon_social', TYPES.VarChar, data.razon_social)
        request.addParameter('tipo_documento_id', TYPES.Int, parseInt(data.tipo_documento_id))
        request.addParameter('tipo_contribuyente', TYPES.VarChar, data.tipo_contribuyente)
        request.addParameter('direccion', TYPES.VarChar, data.direccion)
        request.addParameter('direccion_principal', TYPES.VarChar, data.direccion_principal)
        request.addParameter('telefono', TYPES.VarChar, data.telefono)
        request.addParameter('telefono_movil', TYPES.VarChar, data.telefono_movil)
        request.addParameter('email', TYPES.VarChar, data.email)
        request.addParameter('correo_electronico', TYPES.VarChar, data.correo_electronico)
        request.addParameter('departamento_id', TYPES.Int, parseInt(data.departamento_id))
        request.addParameter('departamento', TYPES.VarChar, data.departamento)
        request.addParameter('ciudad_id', TYPES.Int, parseInt(data.ciudad_id))
        request.addParameter('ciudad', TYPES.VarChar, data.ciudad)
        request.addParameter('pais_id', TYPES.Int, data.pais_id)
        request.addParameter('codigo_ciiu_id', TYPES.Int, parseInt(data.codigo_ciiu_id))
        request.addParameter('actividad_comercial_id', TYPES.Int, parseInt(data.actividad_comercial_id))
        request.addParameter('tipo_regimen_id', TYPES.Int, parseInt(data.tipo_regimen_id))
        request.addParameter('municipio', TYPES.VarChar, data.municipio)
        request.addParameter('estado_empresa', TYPES.VarChar, data.estado_empresa)
        request.addParameter('naturaleza_empresa', TYPES.VarChar, data.naturaleza_empresa)
        request.addParameter('tipo_empresa', TYPES.VarChar, data.tipo_empresa)

        console.log('▶️ Ejecutando consulta SQL de actualización...')
        connection.execSql(request)
      })
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
