import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { ConferenceEnhancerController } from '../controllers/conference-enhancer.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log('Adding enhanced data to new conferences');
  const result = await app
    .get(ConferenceEnhancerController)
    .addEnhancedDataToConferences();

  Logger.log(result);
}
bootstrap();
