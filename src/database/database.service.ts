
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Request, TediousType } from 'tedious';

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
        database: 'Taskmaster',
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

  async executeQuery<T>(sql: string, parameters?: { name: string; type: TediousType; value: any }[]): Promise<T[]> {
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
}
