import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@UserId() userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Put()
  update(@UserId() userId: string, @Body() body: any) {
    return this.goalsService.update(userId, body);
  }
}