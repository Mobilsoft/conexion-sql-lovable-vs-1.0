
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { getTableStats, getTableStructure } from "./services/tableService.ts";
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
      console.log(`Processing ${path} request with data`, JSON.stringify(data));

      // Validate connection data
      if (!data.server || !data.port || !data.database || !data.username || (!data.password && !data.useWindowsAuth)) {
        return new Response(
          JSON.stringify({ error: "Missing required connection parameters" }),
          { status: 400, headers }
        );
      }

      // Connection endpoint
      if (path === "connect") {
        try {
          console.log(`Connecting to SQL Server: ${data.server}:${data.port}/${data.database}`);
          
          const pool = await getConnection({
            server: data.server,
            port: data.port,
            database: data.database || "Mobilpos", // Default to Mobilpos if not specified
            username: data.username,
            password: data.password
          });

          console.log("Connection successful!");
          
          // Get table stats
          const tableStats = await getTableStats(pool);
          console.log(`Retrieved stats for ${tableStats.length} tables`);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Connection successful", 
              data: tableStats 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Connection error:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Connection failed: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
      
      // Table structure endpoint
      if (path === "structure") {
        try {
          console.log(`Getting structure for table: ${data.tableName}`);
          
          if (!data.tableName) {
            return new Response(
              JSON.stringify({ error: "Table name is required" }),
              { status: 400, headers }
            );
          }
          
          const pool = await getConnection({
            server: data.server,
            port: data.port,
            database: data.database || "Mobilpos", // Default to Mobilpos if not specified
            username: data.username,
            password: data.password
          });
          
          const tableStructure = await getTableStructure(pool, data.tableName);
          console.log(`Retrieved structure for table ${data.tableName} with ${tableStructure.length} columns`);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: tableStructure 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Error getting table structure:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Failed to get table structure: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
      
      // Disconnect endpoint
      if (path === "disconnect") {
        try {
          console.log("Disconnecting from SQL Server");
          await clearConnection();
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Disconnected successfully" 
            }),
            { status: 200, headers }
          );
        } catch (error) {
          console.error("Disconnect error:", error.message);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Disconnect failed: ${error.message}` 
            }),
            { status: 500, headers }
          );
        }
      }
    }

    // If we reach here, the endpoint is not supported
    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers }
    );
  } catch (error) {
    console.error("Unhandled error:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `An unexpected error occurred: ${error.message}` 
      }),
      { status: 500, headers }
    );
  }
});
