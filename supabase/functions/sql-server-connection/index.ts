
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './utils/cors.ts'
import { handleGetCompanies, handleInsertCompany, handleUpdateCompany, handleDeleteCompany } from './services/companyService.ts'
import { handleGetTableStats, handleGetTableStructure } from './services/structureService.ts'
import { handleGetCiudades, handleGetDepartamentos } from './services/locationService.ts'
import { handleSeedData } from './services/dataSeederService.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()

    let result
    switch (action) {
      case 'getCompanies':
        result = await handleGetCompanies(data)
        break
      case 'insertCompany':
        result = await handleInsertCompany(data)
        break
      case 'updateCompany':
        result = await handleUpdateCompany(data)
        break
      case 'deleteCompany':
        result = await handleDeleteCompany(data)
        break
      case 'getTableStats':
        result = await handleGetTableStats(data)
        break
      case 'getTableStructure':
        result = await handleGetTableStructure(data)
        break
      case 'getCiudades':
        result = await handleGetCiudades(data)
        break
      case 'getDepartamentos':
        result = await handleGetDepartamentos(data)
        break
      case 'seedTestData':
        result = await handleSeedData(data)
        break
      default:
        throw new Error('Acción no soportada')
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})
