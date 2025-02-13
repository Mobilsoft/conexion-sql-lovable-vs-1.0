
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('table-stats')
  async getTableStats() {
    try {
      const data = await this.statsService.getTableStats();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al obtener estadísticas de tablas' 
      };
    }
  }
}
