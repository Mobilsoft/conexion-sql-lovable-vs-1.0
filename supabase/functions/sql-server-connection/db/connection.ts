
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

    try {
      console.log('Iniciando conexión a SQL Server...')
      globalPool = await new mssql.ConnectionPool(poolConfig).connect()
      console.log('Conexión establecida exitosamente')

      // Agregar evento para manejar errores de conexión
      globalPool.on('error', (err) => {
        console.error('Error en la conexión:', err)
        if (err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('Conexión perdida, limpiando pool...')
          globalPool = null
        }
      })
    } catch (error) {
      console.error('Error al establecer conexión:', error)
      globalPool = null
      throw error
    }
  } else {
    try {
      // Verificar si la conexión sigue activa
      await globalPool.request().query('SELECT 1')
      console.log('Usando conexión existente')
    } catch (error) {
      console.error('Error al verificar conexión existente:', error)
      console.log('Limpiando conexión inválida...')
      globalPool = null
      return getConnection(config)
    }
  }

  return globalPool
}

export const clearConnection = () => {
  if (globalPool) {
    console.log('Cerrando conexión global...')
    try {
      globalPool.close()
    } catch (error) {
      console.error('Error al cerrar conexión:', error)
    }
  }
  globalPool = null
}
