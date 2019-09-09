import { Module } from '@nestjs/common';
import { EmailBuilderService } from './services/email-builder.service';
import { SubscriberConferenceService } from './services/subscriber-conference.service';

@Module({
  providers: [EmailBuilderService, SubscriberConferenceService],
  exports: [EmailBuilderService],
})
export class EmailBuilderModule {}
