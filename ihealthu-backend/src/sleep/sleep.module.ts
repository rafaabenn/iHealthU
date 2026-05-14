import { Module } from '@nestjs/common';
import { SleepController } from './sleep.controller';
import { SleepService } from './sleep.service';
import { StreakModule } from '../auth/streak.module';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [StreakModule, GoalsModule],
  controllers: [SleepController],
  providers: [SleepService],
  exports: [SleepService]
})
export class SleepModule { }
