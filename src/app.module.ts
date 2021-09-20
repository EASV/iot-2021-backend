import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatGateway } from './socket/chat.gateway';
import { HumidityController } from './controllers/humidity.controller';
import { TemperatureController } from './controllers/temperature.controller';
import { HumidityService } from './services/humidity.service';
import { TemperatureService } from './services/temperature.service';
import { TemperatureMqttController } from './Mqtt/temperature.mqtt.controller';
import { HumidityMqttController } from './Mqtt/humidity.mqtt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Temperature, TemperatureSchema } from './data/temperature.schema';
import { Humidity, HumiditySchema } from './data/humidity.schema';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    SocketModule,
    ChatGateway,
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtts://a929b5b752064d73b956cf0f04e5640a.s2.eu.hivemq.cloud',
          port: 8883,
          username: 'classroom',
          password: 'ItsASecret123!',
        },
      },
    ]),
    MongooseModule.forRoot(
      'mongodb+srv://classroom:9Npt4YrmO6E1hxFt@cluster0.dg2lq.mongodb.net/pidata?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Temperature.name, schema: TemperatureSchema },
      { name: Humidity.name, schema: HumiditySchema },
    ]),
  ],
  controllers: [
    HumidityMqttController,
    TemperatureMqttController,
    HumidityController,
    TemperatureController,
  ],
  providers: [HumidityService, TemperatureService],
})
export class AppModule {}
