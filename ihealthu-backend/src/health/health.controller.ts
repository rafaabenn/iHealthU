import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { HealthService } from './health.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  findAll(@UserId() userId: string) {
    return this.healthService.findAll(userId);
  }

  @Post()
  create(@UserId() userId: string, @Body() body: any) {
    return this.healthService.create(userId, body);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.healthService.remove(userId, id);
  }
}