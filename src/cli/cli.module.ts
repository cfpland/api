import { Module } from '@nestjs/common';
import { ConferenceCollectorController } from './controllers/conference-collector.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsProcessorService } from './processors/notifications-processor.service';
import { ConferenceEnhancerController } from './controllers/conference-enhancer.controller';
import { DataAccessModule } from '../data-access/data-access.module';
import { AddLocationsController } from './controllers/add-locations.controller';
import { EmailSenderModule } from '../shared/modules/email-sender/email-sender.module';
import { EmailBuilderModule } from '../shared/modules/email-builder/email-builder.module';

@Module({
  controllers: [
    AddLocationsController,
    ConferenceCollectorController,
    ConferenceEnhancerController,
    NotificationsController,
  ],
  imports: [DataAccessModule, EmailSenderModule, EmailBuilderModule],
  providers: [NotificationsProcessorService],
})
export class CliModule {}
