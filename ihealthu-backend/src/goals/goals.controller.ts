import { Controller, Get, Put, Body } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll() {
    return this.goalsService.findAll();
  }

  @Put()
  update(@Body() body: any) {
    return this.goalsService.update(body);
  }
}