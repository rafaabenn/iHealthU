import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../auth/user-id.decorator';

@UseGuards(JwtGuard)          // every route in this controller requires a valid token
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@UserId() userId: string) {
    return this.activitiesService.findAll(userId);
  }

  @Post()
  create(@UserId() userId: string, @Body() body: any) {
    return this.activitiesService.create(userId, body);
  }

  @Put(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.activitiesService.update(userId, id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.activitiesService.remove(userId, id);
  }
}