import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Temperature, TemperatureDocument } from '../data/temperature.schema';
import { Model } from 'mongoose';
import { Humidity } from '../data/humidity.schema';

@Injectable()
export class TemperatureService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Temperature.name)
    private temperatureModel: Model<TemperatureDocument>,
  ) {}

  sendSensorData(type: string, sensorData: Temperature) {
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

  async saveSensorData(data: Temperature) {
    const model = new this.temperatureModel(data);
    return model.save();
  }

  async getSensorData(sensorId: string): Promise<Temperature[]> {
    return this.temperatureModel.find({ sensorId: sensorId }).exec();
  }

  async getLatest(): Promise<Humidity> {
    return this.temperatureModel.findOne().sort({ measurementTime: -1 }).exec();
  }
}
