
import { serve } from "https://deno.land/std@0.204.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Recibiendo petición:', req.method)
    const body = await req.json()
    console.log('Datos recibidos:', JSON.stringify(body, (key, value) => 
      key === 'password' ? '***' : value
    ))

    // Devolver una respuesta simple para probar
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conexión a la función edge exitosa',
        receivedData: body 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error.toString()
    })
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error interno del servidor',
        details: error.toString(),
        name: error.name,
        stack: error.stack
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
