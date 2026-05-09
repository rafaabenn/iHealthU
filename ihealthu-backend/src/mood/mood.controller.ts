import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MoodService } from './mood.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Get()
  getLogs(@UserId() userId: string) {
    return this.moodService.getLogs(userId);
  }

  @Get('today')
  getToday(@UserId() userId: string) {
    return this.moodService.getToday(userId);
  }

  @Post()
  updateMood(@UserId() userId: string, @Body() data: any) {
    return this.moodService.updateMood(userId, data);
  }
}
