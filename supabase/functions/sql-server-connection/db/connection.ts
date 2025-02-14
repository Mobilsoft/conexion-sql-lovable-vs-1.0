
import mssql from "npm:mssql@9.1.1";

interface ConnectionConfig {
  username: string;
  password: string;
  database: string;
  server: string;
  port: string;
}

let globalPool: mssql.ConnectionPool | null = null;

export const getConnection = async (config: ConnectionConfig): Promise<mssql.ConnectionPool> => {
  try {
    if (!globalPool) {
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
      globalPool = await new mssql.ConnectionPool(poolConfig).connect();
      console.log('✅ Conexión establecida exitosamente');
    } else {
      console.log('✅ Usando conexión existente');
    }

    return globalPool;
  } catch (error) {
    console.error('❌ Error al establecer conexión:', error);
    globalPool = null;
    throw error;
  }
};

export const clearConnection = async () => {
  try {
    if (globalPool) {
      console.log('🔌 Cerrando conexión global...');
      await globalPool.close();
      globalPool = null;
      console.log('✅ Conexión cerrada correctamente');
    }
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
    globalPool = null;
  }
};
