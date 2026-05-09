import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StreakService } from '../auth/streak.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, StreakService],
})
export class DashboardModule {}