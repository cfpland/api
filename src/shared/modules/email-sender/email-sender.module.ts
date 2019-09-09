import { Module } from '@nestjs/common';
import { SendgridSenderClientService } from './clients/sendgrid-sender-client.service';
import { MockSenderClientService } from './clients/mock-sender-client.service';
import { EmailSenderService } from './services/email-sender.service';

const senderClientService = process.env.SG_API_KEY
  ? {
      provide: SendgridSenderClientService,
      useClass: SendgridSenderClientService,
    }
  : {
      provide: SendgridSenderClientService,
      useClass: MockSenderClientService,
    };

@Module({
  providers: [senderClientService, EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
