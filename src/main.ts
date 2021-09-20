import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: 'mqtts://a929b5b752064d73b956cf0f04e5640a.s2.eu.hivemq.cloud',
      port: 8883,
      username: 'classroom',
      password: 'ItsASecret123!',
    },
  });
  await app.startAllMicroservices();
  await app.listen(2500);
}
bootstrap();
