import { Body, Controller, Get, Inject, Param, Put, Query } from '@nestjs/common';
import { TemperatureService } from '../services/temperature.service';
import { Temperature } from '../data/temperature.schema';

@Controller('temperature')
export class TemperatureController {
  constructor(private readonly service: TemperatureService) {}

  @Put()
  update(@Body() dto: Temperature): string {
    return this.service.sendSensorData('temperature', dto);
  }

  @Get()
  get(@Query() query) {
    const sensorId = query.sensorId;
    return this.service.getSensorData(sensorId);
  }

  @Get(':date')
  findOne(@Param() params) {
    if (params.date === 'latest') {
      return this.service.getLatest();
    }
  }
}
