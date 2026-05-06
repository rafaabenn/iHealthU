import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.activitiesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.activitiesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}