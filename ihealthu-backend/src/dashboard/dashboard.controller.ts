import { Controller, Get, UseGuards } from '@nestjs/common';
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

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }
}