
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResponse } from '../types/table-stats';

@Controller('api')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('table-stats')
  getTableStats(): Promise<StatsResponse> {
    return new Promise<StatsResponse>(async (resolve) => {
      try {
        const data = await this.statsService.getTableStats();
        resolve({ success: true, data });
      } catch (error) {
        resolve({ 
          success: false, 
          error: error.message || 'Error al obtener estadísticas de tablas' 
        });
      }
    });
  }
}
