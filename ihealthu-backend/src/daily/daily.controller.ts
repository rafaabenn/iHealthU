import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DailyService } from './daily.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Get('today')
  getToday(@UserId() userId: string) {
    return this.dailyService.getToday(userId);
  }

  @Post('today')
  update(@UserId() userId: string, @Body() body: { water?: number; sleep?: number }) {
    return this.dailyService.update(userId, body);
  }
}