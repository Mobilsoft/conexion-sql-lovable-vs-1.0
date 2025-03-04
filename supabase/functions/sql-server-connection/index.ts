
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { getTableStats, getTableStructure, insertData } from "./services/tableService.ts";
import { getConnection, clearConnection } from "./db/connection.ts";

console.log("SQL Server Connection Edge Function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Add cors headers to all responses
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (req.method === 'POST') {
      const data = await req.json();
      console.log(`Processing ${path} request with data:`, JSON.stringify({
        server: data.server,
        port: data.port,
        database: data.database,
        username: data.username,
        useWindowsAuth: data.useWindowsAuth,
        // Not logging password for security reasons
      }));

      // Validate connection data
      if (!data.server || !data.port || !data.database || !data.username || (!data.password && !data.useWindowsAuth)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Missing required connection parameters" 
          }),
          { status: 400, headers }
        );
      }

      // Connection endpoint
      if (path === "connect") {
        try {
          console.log(`Intentando conectar a SQL Server: ${data.server}:${data.port}/${data.database} con usuario ${data.username}`);
          
          // Intentar establecer conexión con un timeout de 60 segundos
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout al conectar a ${data.server}:${data.port}`)), 60000);
          });
          
          const connectionPromise = getConnection({
            server: data.server,
            port: data.port,
            database: data.database,
            username: data.username,
            password: data.password
          });
          
          // Race entre la conexión y el timeout
          const pool = await Promise.race([connectionPromise, timeoutPromise]);
          
          console.log("¡Conexión exitosa!");
          
          // Get table stats
          console.log("Obteniendo estadísticas de tablas...");
          const tableStats = await getTableStats(pool);
          console.log(`Se obtuvieron estadísticas de ${tableStats.recordset.length} tablas`);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Conexión exitosa", 
              data: tableStats 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Error de conexión:", error.message, error.stack);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Error al conectar: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
      
      // Table structure endpoint
      if (path === "structure") {
        try {
          console.log(`Obteniendo estructura para tabla: ${data.tableName}`);
          
          if (!data.tableName) {
            return new Response(
              JSON.stringify({ error: "Se requiere el nombre de la tabla" }),
              { status: 400, headers }
            );
          }
          
          const pool = await getConnection({
            server: data.server,
            port: data.port,
            database: data.database,
            username: data.username,
            password: data.password
          });
          
          const tableStructure = await getTableStructure(pool, data.tableName);
          console.log(`Se obtuvo estructura para tabla ${data.tableName} con ${tableStructure.recordset.length} columnas`);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: tableStructure 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Error al obtener estructura de tabla:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Error al obtener estructura de tabla: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
      
      // Insert data endpoint
      if (path === "insertData") {
        try {
          console.log(`Insertando datos en tabla: ${data.tableName}`);
          
          if (!data.tableName || !data.data) {
            return new Response(
              JSON.stringify({ error: "Se requiere el nombre de la tabla y los datos" }),
              { status: 400, headers }
            );
          }
          
          const pool = await getConnection({
            server: data.server,
            port: data.port,
            database: data.database,
            username: data.username,
            password: data.password
          });
          
          const result = await insertData(pool, data.tableName, data.data);
          console.log(`Datos insertados en tabla ${data.tableName} exitosamente`);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Datos insertados exitosamente",
              data: result
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Error al insertar datos:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Error al insertar datos: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
      
      // Disconnect endpoint
      if (path === "disconnect") {
        try {
          console.log("Desconectando de SQL Server");
          await clearConnection();
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Desconexión exitosa" 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Error al desconectar:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Error al desconectar: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
    }

    // If we reach here, the endpoint is not supported
    return new Response(
      JSON.stringify({ error: "Endpoint no encontrado" }),
      { status: 404, headers }
    );
  } catch (error) {
    console.error("Error no manejado:", error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Ocurrió un error inesperado: ${error.message}` 
      }),
      { status: 500, headers }
    );
  }
});
