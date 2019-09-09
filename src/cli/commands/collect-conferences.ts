import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { ConferenceCollectorController } from '../controllers/conference-collector.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const result = await app
    .get(ConferenceCollectorController)
    .collectNewConferences();

  Logger.log(result);
}
bootstrap();
