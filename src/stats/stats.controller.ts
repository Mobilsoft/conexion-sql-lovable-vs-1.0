
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResponse } from '../types/table-stats';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/api/table-stats')
  getTableStats(): Promise<StatsResponse> {
    return this.statsService.getTableStats()
      .then(data => ({ success: true, data }))
      .catch(error => ({ 
        success: false, 
        error: error.message || 'Error al obtener estadísticas de tablas' 
      }));
  }
}
