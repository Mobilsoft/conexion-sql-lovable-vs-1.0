
import { DatabaseService } from '@/database/database.service';
import { FormConfiguration } from '@/types/form-configuration';
import { TYPES } from 'tedious';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FormConfigurationService {
  constructor(private readonly db: DatabaseService) {}

  async getFormConfiguration(formId: number): Promise<FormConfiguration | null> {
    const sql = `
      SELECT *
      FROM app_form_configurations
      WHERE form_id = @form_id
      AND estado = 1;
    `;

    const parameters = [
      { name: 'form_id', type: TYPES.Int, value: formId }
    ];

    const results = await this.db.executeQuery<FormConfiguration>(sql, parameters);
    if (results.length === 0) return null;
    
    const config = results[0];
    return {
      ...config,
      configuracion: typeof config.configuracion === 'string' 
        ? JSON.parse(config.configuracion)
        : config.configuracion
    };
  }

  async saveConfiguration(config: Omit<FormConfiguration, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>) {
    const sql = `
      INSERT INTO app_form_configurations (
        form_id,
        nombre,
        descripcion,
        configuracion,
        estado,
        tabla_master
      )
      VALUES (
        @form_id,
        @nombre,
        @descripcion,
        @configuracion,
        @estado,
        @tabla_master
      );
    `;

    const parameters = [
      { name: 'form_id', type: TYPES.Int, value: config.form_id },
      { name: 'nombre', type: TYPES.NVarChar, value: config.nombre },
      { name: 'descripcion', type: TYPES.NVarChar, value: config.descripcion || null },
      { name: 'configuracion', type: TYPES.NVarChar, value: JSON.stringify(config.configuracion) },
      { name: 'estado', type: TYPES.Bit, value: config.estado },
      { name: 'tabla_master', type: TYPES.Char, value: config.tabla_master }
    ];

    return this.db.executeQuery(sql, parameters);
  }

  async updateConfiguration(id: number, config: Partial<FormConfiguration>) {
    const sql = `
      UPDATE app_form_configurations
      SET 
        nombre = @nombre,
        descripcion = @descripcion,
        configuracion = @configuracion,
        estado = @estado,
        tabla_master = @tabla_master,
        fecha_actualizacion = GETDATE()
      WHERE id = @id;
    `;

    const parameters = [
      { name: 'id', type: TYPES.Int, value: id },
      { name: 'nombre', type: TYPES.NVarChar, value: config.nombre },
      { name: 'descripcion', type: TYPES.NVarChar, value: config.descripcion || null },
      { name: 'configuracion', type: TYPES.NVarChar, value: JSON.stringify(config.configuracion) },
      { name: 'estado', type: TYPES.Bit, value: config.estado },
      { name: 'tabla_master', type: TYPES.Char, value: config.tabla_master }
    ];

    return this.db.executeQuery(sql, parameters);
  }
}
