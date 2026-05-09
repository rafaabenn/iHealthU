import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { HealthModule } from './health/health.module';
import { GoalsModule } from './goals/goals.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DailyModule } from './daily/daily.module'; 

@Module({
  imports: [AuthModule, ActivitiesModule, HealthModule, GoalsModule, DashboardModule, DailyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}