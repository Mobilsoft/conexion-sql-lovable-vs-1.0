
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { getConnection, clearConnection } from "./db/connection.ts"
import { getTableStats, getTableStructure, insertCompany, updateCompany, initializeDatabase } from "./services/tableService.ts"
import { corsHeaders, handleCors } from "./utils/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, handleCors())
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

    const pool = await getConnection(data)
    let result

    // Inicializar base de datos si es necesario
    if (action === 'getTableStats') {
      console.log('Verificando y creando estructura de base de datos...')
      await initializeDatabase(pool)
    }

    switch (action) {
      case 'getTableStats':
        console.log('Ejecutando consulta getTableStats')
        result = await getTableStats(pool)
        console.log('Consulta ejecutada exitosamente:', JSON.stringify(result?.recordset))
        break

      case 'getTableStructure':
        console.log('Obteniendo estructura de tabla:', data.tableName)
        result = await getTableStructure(pool, data.tableName)
        console.log('Estructura de tabla obtenida exitosamente:', JSON.stringify(result?.recordset))
        break

      case 'insertCompany':
        console.log('Insertando nueva compañía')
        result = await insertCompany(pool, data)
        console.log('Compañía insertada exitosamente')
        break

      case 'updateCompany':
        console.log('Actualizando compañía')
        result = await updateCompany(pool, data)
        console.log('Compañía actualizada exitosamente')
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
