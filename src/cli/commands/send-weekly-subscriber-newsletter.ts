import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { NotificationsController } from '../controllers/notifications.controller';

// Sends the big weekly email
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log('Weekly Subscriber Newsletter Sending Started');
  const result = await app
    .get(NotificationsController)
    .sendWeeklySubscriberNewsletter();

  Logger.log(result);
}
bootstrap();
