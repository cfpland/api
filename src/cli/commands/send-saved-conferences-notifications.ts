import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { NotificationsController } from '../controllers/notifications.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log('Saved Conference Notifications Started');
  const result = await app
    .get(NotificationsController)
    .sendSavedConferenceNotifications();

  Logger.log(result);
}
bootstrap();
