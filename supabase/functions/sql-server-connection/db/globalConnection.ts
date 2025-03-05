
import mssql from "npm:mssql@9.1.1"

export interface ConnectionConfig {
  username: string;
  password: string;
  database: string;
  server: string;
  port: string;
}

class GlobalConnection {
  private static instance: GlobalConnection;
  private pool: mssql.ConnectionPool | null = null;
  private config: ConnectionConfig | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<mssql.ConnectionPool> | null = null;

  private constructor() {}

  public static getInstance(): GlobalConnection {
    if (!GlobalConnection.instance) {
      GlobalConnection.instance = new GlobalConnection();
    }
    return GlobalConnection.instance;
  }

  public async getConnection(config: ConnectionConfig): Promise<mssql.ConnectionPool> {
    // Si ya hay una conexión activa y es con la misma configuración, la retornamos
    if (this.pool && this.isSameConfig(config)) {
      console.log('📊 Usando conexión global existente');
      return this.pool;
    }

    // Si hay una conexión pendiente, esperamos a que termine
    if (this.isConnecting && this.connectionPromise) {
      console.log('⏳ Esperando conexión pendiente...');
      return this.connectionPromise;
    }

    // Si no hay conexión o la configuración cambió, creamos una nueva
    console.log('🔄 Iniciando nueva conexión global...');
    this.isConnecting = true;
    
    this.connectionPromise = this.createNewConnection(config);
    
    try {
      this.pool = await this.connectionPromise;
      this.config = config;
      console.log('✅ Conexión global establecida exitosamente');
      return this.pool;
    } catch (error) {
      console.error('❌ Error al establecer conexión global:', error);
      this.pool = null;
      this.config = null;
      throw error;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async createNewConnection(config: ConnectionConfig): Promise<mssql.ConnectionPool> {
    // Si hay una conexión existente, la cerramos primero
    if (this.pool) {
      console.log('🔌 Cerrando conexión existente...');
      await this.pool.close();
      this.pool = null;
    }

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
    };

    console.log('🔌 Conectando a:', config.server, 'puerto:', config.port);
    return new mssql.ConnectionPool(poolConfig).connect();
  }

  private isSameConfig(newConfig: ConnectionConfig): boolean {
    return this.config !== null &&
           this.config.server === newConfig.server &&
           this.config.port === newConfig.port &&
           this.config.database === newConfig.database &&
           this.config.username === newConfig.username &&
           this.config.password === newConfig.password;
  }

  public async closeConnection(): Promise<void> {
    if (this.pool) {
      console.log('🔌 Cerrando conexión global...');
      await this.pool.close();
      this.pool = null;
      this.config = null;
      console.log('✅ Conexión global cerrada correctamente');
    }
  }
}

export const globalConnection = GlobalConnection.getInstance();
