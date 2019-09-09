import { Injectable } from '@nestjs/common';
import { EmailDto } from '../../email-builder/dtos/email.dto';
import { SenderResultDto } from '../dtos/sender-result.dto';
import { SendgridSenderClientService } from '../clients/sendgrid-sender-client.service';
import * as moment from 'moment';
import { SubscriberDto } from '../../../../data-access/subscribers/dtos/subscriber.dto';
import { User } from '../../../../data-access/users/entities/user.entity';

@Injectable()
export class EmailSenderService {
  constructor(private readonly senderClient: SendgridSenderClientService) {}

  public sendWeeklySubscriberNewsletter(
    email: EmailDto,
    subscriber: SubscriberDto,
  ): Promise<SenderResultDto> {
    const category = [
      'Weekly Email',
      moment().format('YYYY-MM-DD'),
      subscriber.preferredCategory,
      subscriber.preferredRegion,
    ];

    return this.senderClient.send(email, subscriber, category);
  }

  public sendSavedConferencesEmail(
    email: EmailDto,
    user: User,
  ): Promise<SenderResultDto> {
    const category = ['Saved Conferences Email', 'Pro'];
    return this.senderClient.send(email, user, category);
  }

  public sendSavedSearchesEmail(
    email: EmailDto,
    user: User,
  ): Promise<SenderResultDto> {
    const category = ['Saved Searches Email', 'Pro'];
    return this.senderClient.send(email, user, category);
  }

  public sendWeeklySummaryEmail(
    email: EmailDto,
    user: User,
  ): Promise<SenderResultDto> {
    const category = ['Summary Email', 'Pro'];
    return this.senderClient.send(email, user, category);
  }
}
