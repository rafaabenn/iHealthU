import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StreakModule } from '../auth/streak.module';

@Module({
  imports: [StreakModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }