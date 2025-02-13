
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de SQL Server
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'D3v3l0p3r2024$',
  server: process.env.DB_SERVER || '145.223.75.189',
  database: process.env.DB_DATABASE || 'Taskmaster',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Pool de conexiones
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('SQL Pool Error:', err);
});

// Endpoint para obtener estadísticas de tablas
app.post('/api/table-stats', async (req, res) => {
  try {
    await poolConnect;
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
    
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 3001; // Cambiado a 3001 como puerto por defecto
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
