
import mssql from "npm:mssql@9.1.1"

let globalPool: mssql.ConnectionPool | null = null;
let lastConnectionConfig: ConnectionConfig | null = null;
let isConnecting = false;
let connectionRetries = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

interface ConnectionConfig {
  username: string;
  password: string;
  database: string;
  server: string;
  port: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getConnection = async (config: ConnectionConfig): Promise<mssql.ConnectionPool> => {
  // Si ya hay una conexión activa, verificamos que siga viva
  if (globalPool) {
    try {
      // Prueba rápida para verificar la conexión
      await globalPool.request().query('SELECT 1');
      console.log('✅ Usando conexión existente');
      return globalPool;
    } catch (error) {
      console.log('❌ Conexión existente no responde, intentando reconectar...');
      await clearConnection();
    }
  }

  // Si ya hay un intento de conexión en curso, esperamos
  while (isConnecting) {
    console.log('⏳ Esperando intento de conexión en curso...');
    await sleep(500);
  }

  try {
    isConnecting = true;
    console.log('🔄 Configurando nueva conexión...');
    
    const poolConfig = {
      user: config.username,
      password: config.password,
      database: config.database,
      server: config.server,
      port: parseInt(config.port),
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 15000,
        requestTimeout: 15000,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 300000
      }
    };

    console.log('🔌 Intentando conectar a:', config.server, 'puerto:', config.port);

    try {
      globalPool = await new mssql.ConnectionPool(poolConfig).connect();
      connectionRetries = 0;
      lastConnectionConfig = config;
      
      console.log('✅ Conexión establecida exitosamente');

      // Manejador de errores de conexión
      globalPool.on('error', async (err) => {
        console.error('❌ Error en la conexión:', err);
        
        if (err.code === 'ECONNCLOSED' || err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('🔄 Conexión perdida, intentando reconexión automática...');
          
          if (connectionRetries < MAX_RETRIES && lastConnectionConfig) {
            connectionRetries++;
            await clearConnection();
            try {
              await sleep(RETRY_DELAY);
              globalPool = await getConnection(lastConnectionConfig);
              console.log(`✅ Reconexión exitosa (intento ${connectionRetries})`);
            } catch (reconnectError) {
              console.error(`❌ Error en reconexión (intento ${connectionRetries}):`, reconnectError);
            }
          } else {
            console.error('❌ Máximo número de intentos de reconexión alcanzado');
            await clearConnection();
          }
        }
      });

    } catch (error) {
      console.error('❌ Error al establecer conexión:', error);
      throw error;
    }

  } finally {
    isConnecting = false;
  }

  if (!globalPool) {
    throw new Error('No se pudo establecer la conexión después de múltiples intentos');
  }

  return globalPool;
};

export const clearConnection = async () => {
  if (globalPool) {
    console.log('🔌 Cerrando conexión global...');
    try {
      await globalPool.close();
      console.log('✅ Conexión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
    }
  }
  globalPool = null;
  connectionRetries = 0;
};
