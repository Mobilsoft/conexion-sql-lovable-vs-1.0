
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de SQL Server con mejores prácticas de seguridad
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'D3v3l0p3r2024$',
  server: process.env.DB_SERVER || '145.223.75.189',
  database: process.env.DB_DATABASE || 'Taskmaster',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000, // 30 segundos
    requestTimeout: 30000, // 30 segundos
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Pool de conexiones
let pool;

const createPool = async () => {
  try {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Conexión a SQL Server establecida correctamente');
    
    pool.on('error', err => {
      console.error('Error en el pool de SQL:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        createPool();
      }
    });
  } catch (err) {
    console.error('Error al crear el pool de conexiones:', err);
    setTimeout(createPool, 5000); // Intentar reconectar cada 5 segundos
  }
};

createPool();

// Middleware para verificar la conexión
const ensureConnection = async (req, res, next) => {
  try {
    if (!pool || !pool.connected) {
      await createPool();
    }
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Error de conexión con la base de datos' 
    });
  }
};

// Endpoint para obtener estadísticas de tablas con mejor manejo de errores
app.post('/api/table-stats', ensureConnection, async (req, res) => {
  try {
    console.log('Recibida solicitud para obtener estadísticas de tablas');
    
    const result = await pool.request().query(`
      SELECT 
        t.name AS table_name,
        p.rows AS row_count,
        (SUM(a.used_pages) * 8.0 / 1024) AS size_in_kb
      FROM sys.tables t
      INNER JOIN sys.indexes i ON t.object_id = i.object_id
      INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
      INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
      GROUP BY t.name, p.rows
      ORDER BY t.name;
    `);
    
    console.log('Consulta ejecutada exitosamente');
    res.json({ 
      success: true, 
      data: result.recordset 
    });
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Error al obtener estadísticas de tablas'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  if (pool) {
    pool.close();
  }
  process.exit(0);
});

