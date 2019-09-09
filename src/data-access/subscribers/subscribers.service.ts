import { Injectable } from '@nestjs/common';
import { MailchimpSubscribersClientService } from './clients/mailchimp-subscribers-client.service';
import { SubscriberDto } from './dtos/subscriber.dto';
import { Collection } from '../interfaces/collection.interface';
import { GetAllDataService } from '../interfaces/data-service.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class SubscribersService implements GetAllDataService<SubscriberDto> {
  constructor(
    private readonly subscribersClient: MailchimpSubscribersClientService,
  ) {}

  public getAll(): Observable<Collection<SubscriberDto>> {
    return fromPromise(this.getPromise());
  }

  private async getPromise(): Promise<Collection<SubscriberDto>> {
    let page = 1;
    const perPage = 100;
    const collection = await this.getPage(page, perPage);

    while (collection.total > collection.items.length) {
      page++;
      const newCollection = await this.getPage(page, perPage);
      collection.items = [...collection.items.concat(newCollection.items)];
    }

    return collection;
  }

  private getPage(
    page: number = 1,
    perPage: number = 10,
  ): Promise<Collection<SubscriberDto>> {
    return this.subscribersClient.getSubscribers({ page, perPage });
  }
}
