
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
        IdTercero as id,
        Nombres as nombre,
        Apellidos as apellido,
        NumeroDocumento as documento,
        Telefono1 as telefono,
        Email as email,
        DireccionPrincipal as direccion,
        Ciudad as ciudad,
        Estado as estado
      FROM MAE_Terceros
      WHERE TipoTercero = 'Cliente'
      ORDER BY FechaCreacion DESC
    `;
    return this.executeQuery(sql);
  }

  async getCompanies(): Promise<any[]> {
    const sql = `
      SELECT 
        IdEmpresa as id,
        NIT,
        DigitoVerificacion as dv,
        RazonSocial,
        TipoDocumento as tipo_documento_id,
        TipoContribuyente as tipo_contribuyente,
        DireccionPrincipal as direccion,
        Telefono1 as telefono,
        Email as email,
        Departamento as departamento_id,
        Ciudad as ciudad_id,
        Pais as pais_id,
        CodigoCIIU as codigo_ciiu_id,
        ActividadComercial as actividad_comercial_id,
        TipoRegimen as tipo_regimen_id,
        Ciudad as municipio,
        Estado as estado_empresa
      FROM MAE_Empresas
      WHERE TipoEmpresa = 'Principal'
      ORDER BY FechaCreacion DESC
    `;
    return this.executeQuery(sql);
  }
}
