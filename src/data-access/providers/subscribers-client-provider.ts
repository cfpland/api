import { MailchimpSubscribersClientService } from '../subscribers/clients/mailchimp-subscribers-client.service';
import { MockSubscribersClientService } from '../subscribers/clients/mock-subscribers-client.service';

export const subscribersClientProvider = process.env.MC_API_KEY
  ? {
      provide: MailchimpSubscribersClientService,
      useClass: MailchimpSubscribersClientService,
    }
  : {
      provide: MailchimpSubscribersClientService,
      useClass: MockSubscribersClientService,
    };
