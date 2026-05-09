import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('today')
  getToday(@UserId() userId: string) {
    return this.dashboardService.getToday(userId);
  }

  @Get('summary')
  getSummary(@UserId() userId: string) {
    return this.dashboardService.getSummary(userId);
  }

  @Put('water')
  updateWater(@UserId() userId: string, @Body('amount') amount: number) {
    return this.dashboardService.updateWater(userId, amount);
  }

  @Get('sleep')
  getSleepLogs(@UserId() userId: string) {
    return this.dashboardService.getSleepLogs(userId);
  }

  @Post('sleep')
  logSleep(
    @UserId() userId: string, 
    @Body() sleepData: { bedtime: string; waketime: string; duration: number }
  ) {
    return this.dashboardService.logSleep(userId, sleepData);
  }
}