import { Body, Controller, Get, Inject, Param, Put, Query } from '@nestjs/common';
import { HumidityService } from '../services/humidity.service';
import { Humidity } from '../data/humidity.schema';

@Controller('humidity')
export class HumidityController {
  constructor(private readonly service: HumidityService) {}

  @Put()
  update(@Body() dto: Humidity): string {
    return this.service.sendSensorData('humidity', dto);
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
