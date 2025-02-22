
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Request, TYPES } from 'tedious';

@Injectable()
export class DatabaseService {
  private connection: Connection;

  constructor(private readonly configService: ConfigService) {
    this.connection = new Connection({
      server: '145.223.75.189',
      authentication: {
        type: 'default',
        options: {
          userName: 'sa',
          password: 'D3v3l0p3r2024$',
        },
      },
      options: {
        database: 'Mobilpos',
        port: 1433,
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: 30000,
        requestTimeout: 30000,
      },
    });

    this.connection.on('connect', (err) => {
      if (err) {
        console.error('Error connecting to SQL Server:', err);
      } else {
        console.log('Connected to SQL Server');
      }
    });

    this.connection.connect();
  }

  async executeQuery<T>(sql: string, parameters?: { name: string; type: typeof TYPES[keyof typeof TYPES]; value: any }[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = new Request(sql, (err, rowCount, rows) => {
        if (err) {
          reject(err);
        } else {
          const result = rows.map(row => {
            const obj: any = {};
            row.forEach(col => {
              obj[col.metadata.colName] = col.value;
            });
            return obj;
          });
          resolve(result);
        }
      });

      if (parameters) {
        parameters.forEach(param => {
          request.addParameter(param.name, param.type, param.value);
        });
      }

      this.connection.execSql(request);
    });
  }

  async getClients(): Promise<any[]> {
    const sql = `
      SELECT 
        id,
        nombre,
        apellidos as apellido,
        documento,
        telefono,
        email,
        direccion,
        ciudad,
        estado
      FROM dbo.gen_usuarios
      WHERE tipo = 'Cliente'
      ORDER BY fecha_creacion DESC
    `;
    return this.executeQuery(sql);
  }

  async getCompanies(): Promise<any[]> {
    const sql = `
      SELECT 
        id,
        nit,
        dv,
        razon_social as RazonSocial,
        tipo_documento as tipo_documento_id,
        tipo_contribuyente,
        direccion,
        telefono,
        email,
        departamento_id,
        ciudad_id,
        pais_id,
        codigo_ciiu as codigo_ciiu_id,
        actividad_comercial as actividad_comercial_id,
        tipo_regimen as tipo_regimen_id,
        ciudad as municipio,
        estado as estado_empresa
      FROM dbo.companies
      WHERE tipo = 'Principal'
      ORDER BY fecha_creacion DESC
    `;
    return this.executeQuery(sql);
  }
}
