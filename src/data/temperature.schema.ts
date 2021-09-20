import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TemperatureDocument = Temperature & Document;

@Schema()
export class Temperature {
  @Prop()
  sensorId: string;

  @Prop()
  value: number;

  @Prop()
  measurementTime: Date;
}

export const TemperatureSchema = SchemaFactory.createForClass(Temperature);
