import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Humidity, HumidityDocument } from '../data/humidity.schema';

@Injectable()
export class HumidityService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Humidity.name)
    private humidityModel: Model<HumidityDocument>,
  ) {}

  sendSensorData(type: string, sensorData: Humidity) {
    switch (type) {
      case 'temperature':
        this.client.emit('temperature/changed', JSON.stringify(sensorData));
        break;
      case 'humidity':
        this.client.emit('humidity/changed', JSON.stringify(sensorData));
        break;
    }
    return '';
  }

  async saveSensorData(data: Humidity) {
    const model = new this.humidityModel(data);
    return model.save();
  }

  async getSensorData(sensorId: string): Promise<Humidity[]> {
    return this.humidityModel.find({ sensorId: sensorId }).exec();
  }

  async getLatest(): Promise<Humidity> {
    return this.humidityModel.findOne().sort({ measurementTime: -1 }).exec();
  }
}
