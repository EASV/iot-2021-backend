import { Controller, Inject } from '@nestjs/common';
import {
  ClientMqtt,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { HumidityService } from '../services/humidity.service';
import { Humidity } from '../data/humidity.schema';
import { SocketService } from '../socket/socket.service';

@Controller()
export class HumidityMqttController {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    private readonly service: HumidityService,
    private readonly socketService: SocketService,
  ) {}

  @MessagePattern('humidity/changed')
  async humidityChanged(@Payload() data: any, @Ctx() context: MqttContext) {
    const sensorData: Humidity = JSON.parse(data);
    const savedData = await this.service.saveSensorData(sensorData);
    this.socketService.server.emit(sensorData.sensorId, savedData);
    return savedData;
  }
}
