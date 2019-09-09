import { Injectable } from '@nestjs/common';
import { ConferencesClientInterface } from './conferences-client.interface';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { NewConferenceDto } from '../dtos/conference.dto';
import { ConferenceProvider } from '../../../shared/types/conference-provider';
import fetch from 'node-fetch';
import * as moment from 'moment';
import { Category, CategoryArray } from '../../../shared/types/category';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class CallingAllPapersClientService
  implements ConferencesClientInterface {
  public readonly providerName: ConferenceProvider = 'Calling All Papers';
  private readonly baseUrl: string = 'https://api.callingallpapers.com/v1/cfp';

  public async getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<NewConferenceDto>> {
    const results = await fetch(this.baseUrl).then(data => data.json());

    const items = results.cfps
      .filter(this.filterConferencesFromExistingSources)
      .map(this.resultToConferenceDto)
      .filter(conference =>
        this.filterConferencesByMaxDaysUntilCfpEnds(options, conference),
      );

    return Promise.resolve({ items, total: items.length });
  }

  private filterConferencesFromExistingSources = (result: any): any =>
    !result.sources.includes('confs.tech');

  private resultToConferenceDto = (result: any): NewConferenceDto => ({
    name: result.name,
    category: this.getCategory(result),
    event_url: result.eventUri,
    provider: this.providerName,
    providerId: result._rel.cfp_uri,
    cfp_due_date: result.dateCfpEnd
      ? moment(result.dateCfpEnd).toDate()
      : undefined,
    cfp_url: result.uri,
    event_start_date: result.dateEventStart
      ? moment(result.dateEventStart).toDate()
      : undefined,
    event_end_date: result.dateEventEnd
      ? moment(result.dateEventEnd).toDate()
      : undefined,
    location: this.getLocation(result),
  });

  private filterConferencesByMaxDaysUntilCfpEnds = (
    options: ConferenceClientOptionsDto,
    conference: NewConferenceDto,
  ): boolean =>
    moment(conference.cfp_due_date).diff(moment.now(), 'days') <=
      options.maxDaysUntilCfpEnds &&
    moment(conference.cfp_due_date).diff(moment.now(), 'days') >= 0;

  private getLocation(result: any): string {
    return result.location.replace(/(\r\n|\n|\r)/gm, '').trim();
  }

  private getCategory(result: any): Category | undefined {
    const likelyCategories = CategoryArray.filter(category => {
      return result.tags
        .map(tag => tag.toLowerCase())
        .includes(category.toLowerCase());
    });

    return likelyCategories.length === 1 ? likelyCategories[0] : undefined;
  }
}
