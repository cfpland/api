import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from '../../email-builder/dtos/email.dto';
import { SenderResultDto } from '../dtos/sender-result.dto';
import sendgridClient = require('@sendgrid/mail');
import { ConfigService } from '../../../../config/config.service';

@Injectable()
export class SendgridSenderClientService {
  private client: any;

  constructor(private readonly config: ConfigService) {
    this.client = sendgridClient;
    this.client.setApiKey(this.config.get('SG_API_KEY'));
  }

  public async send(
    email: EmailDto,
    subscriber: { email: string },
    category: string[] = [],
  ): Promise<SenderResultDto> {
    const senderResult = {
      emailAddress: subscriber.email,
      sentAt: new Date(),
      success: false,
    };

    const options = {
      to: subscriber.email,
      from: {
        email: 'info@cfpland.com',
        name: 'Karl at CFP Land',
      },
      category: [...new Set(category)],
      subject: email.subject,
      html: email.html,
      tracking_settings: {
        click_tracking: {
          enable: true,
        },
        open_tracking: {
          enable: true,
          substitution_tag: '%opentracker%',
        },
        ganalytics: {
          enable: true,
          utm_source: 'cfpland_newsletter',
          utm_medium: 'email',
          utm_campaign: category[0],
          utm_term: senderResult.sentAt,
        },
      },
    };

    try {
      await this.client.send(options, true);
      senderResult.success = true;
    } catch (e) {
      Logger.error(e);
    }

    return senderResult;
  }
}
