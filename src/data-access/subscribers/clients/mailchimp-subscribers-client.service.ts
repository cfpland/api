import { Injectable } from '@nestjs/common';
import Mailchimp = require('mailchimp-api-v3');
import { SubscribersClientOptionsDto } from '../dtos/subscribers-client-options.dto';
import { SubscriberDto } from '../dtos/subscriber.dto';
import { Category } from '../../../shared/types/category';
import { Region } from '../../../shared/types/region';
import { SubscriberProvider } from '../../../shared/types/subscriber-provider';
import { collect } from '../../../shared/functions/collect';
import { ConfigService } from '../../../config/config.service';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class MailchimpSubscribersClientService {
  private accountId: string;
  private listId: string;
  private listBaseUrl;
  private client: any;
  private defaultCategory: Category = 'None';
  private defaultRegion: Region = 'None';
  private providerName: SubscriberProvider = 'Mailchimp';

  constructor(private readonly config: ConfigService) {
    this.client = new Mailchimp(this.config.get('MC_API_KEY'));
    this.accountId = this.config.get('MC_ACCOUNT_ID');
    this.listId = this.config.get('MC_LIST_ID');
    this.listBaseUrl = this.config.get('MC_LIST_BASE_URL');
  }

  public getSubscribers(
    options: SubscribersClientOptionsDto,
  ): Promise<Collection<SubscriberDto>> {
    return this.client
      .get(`lists/${this.listId}/members`, {
        status: 'subscribed',
        count: options.perPage,
        offset: options.perPage * options.page - options.perPage,
      })
      .then(data => {
        const items = data.members.map(m => this.memberToSubscriber(m));

        return collect(items, data.total_items);
      });
  }

  private memberToSubscriber(member: any): SubscriberDto {
    return {
      email: member.email_address,
      firstName: member.merge_fields.FNAME || undefined,
      lastName: member.merge_fields.LNAME || undefined,
      preferredCategory: this.getCategory(member.merge_fields.CATEGORY),
      preferredRegion: member.merge_fields.REGION || this.defaultRegion,
      profileLink: this.getProfileUrl(member.unique_email_id),
      provider: this.providerName,
      providerId: member.unique_email_id,
      twitter: member.merge_fields.TWITTER || undefined,
      unsubscribeLink: this.getUnsubscribeUrl(member.unique_email_id),
      website: member.merge_fields.WEBSITE || undefined,
    };
  }

  private getCategory(mailchimpCategory: string): Category {
    switch (mailchimpCategory) {
      case '.NET':
        return '.NET';
      case 'CSS':
        return 'CSS';
      case 'Data, Databases, and Machine Learning':
        return 'Data';
      case 'Design':
        return 'Design';
      case 'DevOps':
        return 'DevOps';
      case 'Go':
        return 'Go';
      case 'Java':
        return 'Java';
      case 'Javascript':
        return 'Javascript';
      case 'Mobile':
        return 'Mobile';
      case 'PHP':
        return 'PHP';
      case 'Python':
        return 'Python';
      case 'Ruby':
        return 'Ruby';
      case 'Security':
        return 'Security';
      default:
        return this.defaultCategory;
    }
  }

  private getProfileUrl(providerId: string): string {
    return `${this.listBaseUrl}/profile?u=${this.accountId}&id=${this.listId}&e=${providerId}`;
  }

  private getUnsubscribeUrl(providerId: string): string {
    return `${this.listBaseUrl}/unsubscribe?u=${this.accountId}&id=${this.listId}&e=${providerId}`;
  }
}
