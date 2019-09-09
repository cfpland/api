import { Injectable } from '@nestjs/common';
import { ConferencesClientInterface } from './conferences-client.interface';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { ConferenceDto, NewConferenceDto } from '../dtos/conference.dto';
import { ConferenceProvider } from '../../../shared/types/conference-provider';
import fetch from 'node-fetch';
import * as moment from 'moment';
import { Collection } from '../../interfaces/collection.interface';

/**
 * Note: This client is currently disabled
 * The maintainer did not appreciate my use of
 * his API, so I've turned it off.
 */

@Injectable()
export class CfpTimeClientService implements ConferencesClientInterface {
  public readonly providerName: ConferenceProvider = 'CFPTime';
  private readonly baseUrl: string = 'https://www.cfptime.org/api/cfps';

  public async getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    const results = await fetch(this.baseUrl).then(data => data.json());

    const items = results
      .map(this.resultToConferenceDto)
      .filter(conference =>
        this.filterConferencesByMaxDaysUntilCfpEnds(options, conference),
      );

    return Promise.resolve({ items, total: items.length });
  }

  private resultToConferenceDto = (result: any): NewConferenceDto => ({
    name: result.name,
    category: 'Security',
    event_url: result.website,
    provider: this.providerName,
    providerId: result.id,
    cfp_due_date: result.cfp_deadline
      ? moment(result.cfp_deadline).toDate()
      : undefined,
    cfp_url: result.website,
    event_start_date: result.conf_start_date
      ? moment(result.conf_start_date).toDate()
      : undefined,
    location: `${result.city}, ${result.province}, ${result.country}`,
    twitter: this.getTwitterHandle(result),
  });

  private filterConferencesByMaxDaysUntilCfpEnds = (
    options: ConferenceClientOptionsDto,
    conference: NewConferenceDto,
  ): boolean =>
    moment(conference.cfp_due_date).diff(moment.now(), 'days') <=
    options.maxDaysUntilCfpEnds;

  private getTwitterHandle(result: any): string | undefined {
    if (result && result.twitter) {
      return result.twitter.startsWith('#') || result.twitter.startsWith('@')
        ? result.twitter
        : `@${result.twitter}`;
    }

    return undefined;
  }
}
