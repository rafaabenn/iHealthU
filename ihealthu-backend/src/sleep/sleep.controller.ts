import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Get()
  getLogs(@UserId() userId: string, @Query('endDate') endDate?: string) {
    return this.sleepService.getLogs(userId, endDate);
  }

  @Get('today')
  getToday(@UserId() userId: string) {
    return this.sleepService.getTodayStats(userId);
  }

  @Post()
  addLog(@UserId() userId: string, @Body() data: any) {
    return this.sleepService.addLog(userId, data);
  }

  @Delete(':id')
  deleteLog(@UserId() userId: string, @Param('id') id: string) {
    return this.sleepService.deleteLog(userId, id);
  }
}
