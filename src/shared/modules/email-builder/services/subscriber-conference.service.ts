import { Injectable } from '@nestjs/common';
import { SubscriberDto } from '../../../../data-access/subscribers/dtos/subscriber.dto';
import { ConferenceDto } from '../../../../data-access/conferences/dtos/conference.dto';
import { SubscriberConferenceDto } from '../dtos/subscriber-conference.dto';
import { collect } from '../../../functions/collect';
import { Collection } from '../../../../data-access/interfaces/collection.interface';

@Injectable()
export class SubscriberConferenceService {
  public preferenceSort(
    subscriber: SubscriberDto,
    conferences: Collection<ConferenceDto>,
  ): Collection<SubscriberConferenceDto> {
    return this.sort(this.addPreferences(subscriber, conferences));
  }

  public addPreferences(
    subscriber: SubscriberDto,
    conferences: Collection<ConferenceDto>,
  ): Collection<SubscriberConferenceDto> {
    const items = conferences.items.map(conference => {
      const preferencedConference = { ...conference, preferred: false };

      if (
        subscriber.preferredRegion !== 'None' &&
        subscriber.preferredCategory !== 'None' &&
        conference.region === subscriber.preferredRegion &&
        conference.category === subscriber.preferredCategory
      ) {
        preferencedConference.preferred = true;
      } else if (
        subscriber.preferredRegion === 'None' &&
        subscriber.preferredCategory !== 'None' &&
        conference.category === subscriber.preferredCategory
      ) {
        preferencedConference.preferred = true;
      } else if (
        subscriber.preferredRegion !== 'None' &&
        subscriber.preferredCategory === 'None' &&
        conference.region === subscriber.preferredRegion
      ) {
        preferencedConference.preferred = true;
      }

      return preferencedConference;
    });

    return collect(items);
  }

  public sort(
    conferences: Collection<SubscriberConferenceDto>,
  ): Collection<SubscriberConferenceDto> {
    // Sort the conferences
    conferences.items.sort((a, b) =>
      a.preferred === b.preferred
        ? // Sort by date if both preferred/not preferred
          a.cfp_due_date.getTime() - b.cfp_due_date.getTime()
        : // Try to sort by preferred "true"
        a.preferred
        ? -1
        : 1,
    );

    return conferences;
  }
}
