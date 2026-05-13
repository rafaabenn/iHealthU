import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { HealthModule } from './health/health.module';
import { GoalsModule } from './goals/goals.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DailyModule } from './daily/daily.module'; 
import { SleepModule } from './sleep/sleep.module';
import { MoodModule } from './mood/mood.module';

@Module({
  imports: [
    AuthModule, 
    ActivitiesModule, 
    HealthModule, 
    GoalsModule, 
    DashboardModule, 
    DailyModule,
    SleepModule,
    MoodModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}