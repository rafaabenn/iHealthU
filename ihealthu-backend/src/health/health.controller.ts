import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  findAll() {
    return this.healthService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.healthService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthService.remove(id);
  }
}