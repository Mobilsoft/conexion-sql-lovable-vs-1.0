
import mssql from "npm:mssql@9.1.1"

let globalPool: mssql.ConnectionPool | null = null;

interface ConnectionConfig {
  username: string;
  password: string;
  database: string;
  server: string;
  port: string;
}

export const getConnection = async (config: ConnectionConfig): Promise<mssql.ConnectionPool> => {
  if (!globalPool) {
    console.log('Configurando nueva conexión...')
    console.log('Intentando conectar a:', config.server, 'puerto:', config.port)

    const poolConfig = {
      user: config.username,
      password: config.password,
      database: config.database,
      server: config.server,
      port: parseInt(config.port),
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 300000
      },
      connectionTimeout: 15000,
      requestTimeout: 15000
    }

    console.log('Iniciando conexión a SQL Server...')
    globalPool = await new mssql.ConnectionPool(poolConfig).connect()
    console.log('Conexión establecida exitosamente')
  }

  return globalPool
}

export const clearConnection = () => {
  globalPool = null
}
