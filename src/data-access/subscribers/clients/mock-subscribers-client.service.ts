import { Injectable } from '@nestjs/common';
import { SubscribersClientOptionsDto } from '../dtos/subscribers-client-options.dto';
import { SubscriberDto } from '../dtos/subscriber.dto';
import { collect } from '../../../shared/functions/collect';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class MockSubscribersClientService {
  private subscribers: SubscriberDto[] = [
    {
      email: 'khughes.me@gmail.com',
      firstName: 'Karl',
      lastName: 'Hughes',
      preferredCategory: 'General',
      preferredRegion: 'Americas',
      profileLink:
        'https://cfpland.us15.list-manage.com/profile?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
      provider: 'Test',
      providerId: 'abc123',
      unsubscribeLink:
        'https://cfpland.us15.list-manage.com/unsubscribe?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
    },
    // {
    //   email: 'khughes.me@gmail.com',
    //   firstName: 'Karl',
    //   lastName: 'Hughes',
    //   preferredCategory: 'Javascript',
    //   preferredRegion: 'Europe',
    //   profileLink:
    //     'https://cfpland.us15.list-manage.com/profile?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
    //   provider: 'Test',
    //   providerId: 'abc123',
    //   unsubscribeLink:
    //     'https://cfpland.us15.list-manage.com/unsubscribe?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
    // },
    // {
    //   email: 'khughes.me@gmail.com',
    //   firstName: 'Karl',
    //   lastName: 'Hughes',
    //   preferredCategory: 'None',
    //   preferredRegion: 'None',
    //   profileLink:
    //     'https://cfpland.us15.list-manage.com/profile?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
    //   provider: 'Test',
    //   providerId: 'abc123',
    //   unsubscribeLink:
    //     'https://cfpland.us15.list-manage.com/unsubscribe?u=4eba8b205fc13380cd3e6f3fc&id=258f553f4e&e=fa483d7173',
    // },
  ];

  public getSubscribers(
    options: SubscribersClientOptionsDto,
  ): Promise<Collection<SubscriberDto>> {
    return Promise.resolve(collect(this.subscribers));
  }
}
