
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { getConnection, clearConnection } from "./db/connection.ts"
import { 
  getTableStats, 
  getTableStructure, 
  insertCompany, 
  updateCompany, 
  initializeDatabase, 
  getCompanies, 
  getCiudades, 
  getDepartamentos, 
  deleteCompany 
} from "./services/index.ts"
import { corsHeaders, handleCors } from "./utils/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, handleCors())
  }
  
  try {
    const body = await req.json()
    console.log('📦 Datos recibidos:', JSON.stringify(body, (key, value) => 
      key === 'password' ? '***' : value
    ))

    const { action, data } = body

    if (!action || !data) {
      throw new Error('Se requieren los campos action y data')
    }

    console.log('🔌 Verificando conexión...')
    const pool = await getConnection(data)
    console.log('✅ Conexión verificada')
    let result

    if (action === 'getTableStats') {
      console.log('🏗️ Verificando y creando estructura de base de datos...')
      try {
        await initializeDatabase(pool)
        console.log('✅ Base de datos inicializada correctamente')
      } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error)
        throw error
      }
    }

    console.log('🎯 Ejecutando acción:', action)
    switch (action) {
      case 'getTableStats':
        console.log('📊 Ejecutando consulta getTableStats')
        result = await getTableStats(pool)
        break

      case 'getTableStructure':
        console.log('🔍 Obteniendo estructura de tabla:', data.tableName)
        result = await getTableStructure(pool, data.tableName)
        break

      case 'insertCompany':
        console.log('➕ Insertando nueva compañía')
        result = await insertCompany(pool, data)
        break

      case 'updateCompany':
        console.log('📝 Actualizando compañía')
        result = await updateCompany(pool, data)
        break
        
      case 'getCompanies':
        console.log('📋 Obteniendo lista de compañías')
        result = await getCompanies(pool)
        break

      case 'getCiudades':
        console.log('🏙️ Obteniendo lista de ciudades')
        result = await getCiudades(pool)
        break

      case 'getDepartamentos':
        console.log('🗺️ Obteniendo lista de departamentos')
        result = await getDepartamentos(pool)
        break

      case 'deleteCompany':
        console.log('❌ Eliminando compañía')
        result = await deleteCompany(pool, data.nit)
        break

      default:
        throw new Error('Acción no válida: ' + action)
    }

    console.log('🏁 Operación completada exitosamente')
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
    console.error('❌ Error:', error)
    
    // Solo limpiar la conexión si es un error fatal de conexión
    if (error instanceof Error && 
       (error.message.includes('Failed to connect') || 
        error.message.includes('Connection closed') || 
        error.message.includes('Connection reset'))) {
      console.log('🔄 Error fatal de conexión, limpiando pool...')
      clearConnection()
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
