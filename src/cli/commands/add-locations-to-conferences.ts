import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { AddLocationsController } from '../controllers/add-locations.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log('Adding locations to new conferences');
  const result = await app
    .get(AddLocationsController)
    .addLocationsToConferences();

  Logger.log(result);
}
bootstrap();
