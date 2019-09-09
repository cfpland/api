import { Injectable } from '@nestjs/common';
import { EmailDto } from '../../email-builder/dtos/email.dto';
import { SenderResultDto } from '../dtos/sender-result.dto';
import { SubscriberDto } from '../../../../data-access/subscribers/dtos/subscriber.dto';

@Injectable()
export class MockSenderClientService {
  public send(
    email: EmailDto,
    subscriber: SubscriberDto,
  ): Promise<SenderResultDto> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            emailAddress: subscriber.email,
            sentAt: new Date(),
            success: true,
          }),
        100,
      );
    });
  }
}
