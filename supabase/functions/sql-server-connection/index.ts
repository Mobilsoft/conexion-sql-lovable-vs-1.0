
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { getConnection, clearConnection } from "./db/connection.ts"
import { corsHeaders, handleCors } from "./utils/cors.ts"
import { Connection, Request, TYPES } from "npm:tedious@15.1.0"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, handleCors())
  }
  
  try {
    const { action, data } = await req.json()
    console.log('Datos recibidos:', JSON.stringify(data))

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

    const config = {
      server: '145.223.75.189',
      authentication: {
        type: 'default',
        options: {
          userName: 'sa',
          password: 'D3v3l0p3r2024$'
        }
      },
      options: {
        database: 'Taskmaster',
        encrypt: true,
        trustServerCertificate: true,
        port: 1433
      }
    }

    const connection = new Connection(config)

    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })

    let result

    if (action === 'insertCompany') {
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

        const request = new Request(query, (err) => {
          if (err) {
            console.error('Error en insert:', err)
            reject(err)
          } else {
            resolve({ success: true })
          }
        })

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

        connection.execSql(request)
      })
    } else if (action === 'updateCompany') {
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

        const request = new Request(query, (err) => {
          if (err) {
            console.error('Error en update:', err)
            reject(err)
          } else {
            resolve({ success: true })
          }
        })

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

        connection.execSql(request)
      })
    }

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
