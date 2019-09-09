import { Injectable, Logger } from '@nestjs/common';
import { ConferencesClientInterface } from './conferences-client.interface';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { ConferenceDto, NewConferenceDto } from '../dtos/conference.dto';
import { ConferenceProvider } from '../../../shared/types/conference-provider';
import fetch from 'node-fetch';
import * as moment from 'moment';
import { collect } from '../../../shared/functions/collect';
import { Collection } from '../../interfaces/collection.interface';
const filenameToCategoryMap = {
  'android.json': 'Mobile',
  'clojure.json': 'General',
  'cpp.json': 'General',
  'css.json': 'CSS',
  'data.json': 'Data',
  'devops.json': 'DevOps',
  'dotnet.json': '.NET',
  'elixir.json': 'General',
  'general.json': 'General',
  'golang.json': 'Go',
  'graphql.json': 'Data',
  'ios.json': 'Mobile',
  'java.json': 'Java',
  'javascript.json': 'Javascript',
  'networking.json': 'General',
  'php.json': 'PHP',
  'python.json': 'Python',
  'ruby.json': 'Ruby',
  'rust.json': 'General',
  'scala.json': 'Java',
  'security.json': 'Security',
  'tech-comm.json': 'General',
  'ux.json': 'Design',
};

@Injectable()
export class ConfstechClientService implements ConferencesClientInterface {
  public readonly providerName: ConferenceProvider = 'Confs.tech';
  private readonly baseUrl: string =
    'https://api.github.com/repos/tech-conferences/conference-data/contents/conferences';
  private minYear: number;

  constructor() {
    this.minYear = new Date().getFullYear();
  }

  public async getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    const years = await this.getYears();

    let results = [];

    for (const yearObject of years) {
      const categories = await this.getCategories(yearObject.name);

      // Get results for each category
      for (const categorySpec of categories) {
        try {
          // Get the results and attach a filename to each
          const category = (await this.getCategory(
            categorySpec.download_url,
          )).map(item => this.filenameToCategory(item, categorySpec.name));

          results = results.concat(category);
        } catch (e) {
          Logger.error(e);
        }
      }
    }

    const items = results
      .map(this.resultToConferenceDto)
      .filter(conference =>
        this.filterConferencesByMaxDaysUntilCfpEnds(options, conference),
      );

    return Promise.resolve(collect(items));
  }

  private async getYears() {
    const years = await fetch(this.baseUrl).then(data => data.json());

    return years.filter(result => Number(result.name) >= this.minYear);
  }

  private getCategories(year) {
    return fetch(`${this.baseUrl}/${year}`).then(data => data.json());
  }

  private getCategory(downloadUrl) {
    return fetch(downloadUrl).then(data => data.json());
  }

  private filenameToCategory = (conference, filename) => {
    const category =
      filename && filenameToCategoryMap[filename]
        ? filenameToCategoryMap[filename]
        : 'General';

    return {
      ...conference,
      category,
    };
  };

  private resultToConferenceDto = (result: any): NewConferenceDto => ({
    name: result.name,
    category: result.category,
    event_url: result.url,
    provider: this.providerName,
    cfp_due_date: result.cfpEndDate
      ? moment(result.cfpEndDate).toDate()
      : undefined,
    cfp_url: result.cfpUrl,
    event_end_date: result.endDate
      ? moment(result.endDate).toDate()
      : undefined,
    event_start_date: result.startDate
      ? moment(result.startDate).toDate()
      : undefined,
    location: `${result.city}, ${result.country}`,
    twitter: result.twitter,
  });

  private filterConferencesByMaxDaysUntilCfpEnds = (
    options: ConferenceClientOptionsDto,
    conference: NewConferenceDto,
  ): boolean =>
    conference.cfp_due_date !== undefined &&
    moment(conference.cfp_due_date).diff(moment.now(), 'days') <=
      options.maxDaysUntilCfpEnds &&
    moment(conference.cfp_due_date).diff(moment.now(), 'days') >= 0;
}
