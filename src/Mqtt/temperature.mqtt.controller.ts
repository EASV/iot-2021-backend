import { Controller, Inject } from '@nestjs/common';
import {
  ClientMqtt,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { Temperature, TemperatureDocument } from '../data/temperature.schema';
import { TemperatureService } from '../services/temperature.service';
import { SocketService } from '../socket/socket.service';

@Controller()
export class TemperatureMqttController {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    private readonly service: TemperatureService,
    private readonly socketService: SocketService,
  ) {}

  @MessagePattern('temperature/changed')
  async temperatureChanged(@Payload() data: any, @Ctx() context: MqttContext) {
    const sensorData: Temperature = JSON.parse(data);
    const savedData = await this.service.saveSensorData(sensorData);
    this.socketService.server.emit(sensorData.sensorId, savedData);
    return savedData;
  }
}
