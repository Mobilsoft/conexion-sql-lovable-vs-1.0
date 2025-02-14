
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './utils/cors.ts'
import { companyService } from './services/companyService.ts'
import { getConnection, clearConnection } from './db/connection.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    console.log('📥 Acción recibida:', action)

    let result
    const connection = await getConnection(data)

    try {
      switch (action) {
        case 'getCompanies':
          console.log('🔍 Obteniendo compañías...')
          result = await companyService.getCompanies(connection)
          break
        case 'insertCompany':
          console.log('➕ Insertando compañía...')
          result = await companyService.insertCompany(connection, data)
          break
        case 'updateCompany':
          console.log('✏️ Actualizando compañía...')
          result = await companyService.updateCompany(connection, data)
          break
        case 'deleteCompany':
          console.log('🗑️ Eliminando compañía...')
          result = await companyService.deleteCompany(connection, data.nit)
          break
        case 'getCodigosCIIU':
          console.log('🔍 Obteniendo códigos CIIU...')
          result = await companyService.getCodigosCIIU(connection)
          break
        case 'getActividadesComerciales':
          console.log('🔍 Obteniendo actividades comerciales...')
          result = await companyService.getActividadesComerciales(connection)
          break
        case 'getTiposRegimen':
          console.log('🔍 Obteniendo tipos de régimen...')
          result = await companyService.getTiposRegimen(connection)
          break
        default:
          throw new Error('Acción no soportada')
      }

      console.log('✅ Operación completada exitosamente')
      return new Response(
        JSON.stringify({ success: true, data: result.recordset || result }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } finally {
      if (connection) {
        await clearConnection()
      }
    }
  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
