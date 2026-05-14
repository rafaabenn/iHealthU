import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { StreakModule } from '../auth/streak.module';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [StreakModule, GoalsModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule { }