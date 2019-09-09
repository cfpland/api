import { Injectable } from '@nestjs/common';
import Airtable = require('airtable');
import { Category } from '../../../shared/types/category';
import { Region } from '../../../shared/types/region';
import { ConferenceDto } from '../dtos/conference.dto';
import { ConferenceProvider } from '../../../shared/types/conference-provider';
import { AirtableCategoryDto } from '../dtos/airtable-category.dto';
import { collect } from '../../../shared/functions/collect';
import { AirtableConferenceClientOptionsDto } from '../dtos/airtable-conference-client-options.dto';
import { ConferencesClientInterface } from './conferences-client.interface';
import { ConfigService } from '../../../config/config.service';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class AirtableConferencesClientService
  implements ConferencesClientInterface {
  public readonly providerName: ConferenceProvider = 'Airtable';
  private base: any;
  private categories: AirtableCategoryDto[] | undefined;
  private defaultCategory: Category = 'General';
  private defaultRegion: Region = 'None';

  constructor(private readonly config: ConfigService) {
    if (!this.config.get('AT_API_KEY')) {
      throw new Error('AT_API_KEY is required');
    }
    this.base = new Airtable({ apiKey: this.config.get('AT_API_KEY') }).base(
      this.config.get('AT_BASE_ID'),
    );
  }

  public async getAllConferences(
    options?: AirtableConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    const view = this.getViewFromOptions(options);
    const filterByFormula = this.getFilterFormulaFromOptions(options);

    this.categories = await this.getAllCategories();
    const items = await this.base('conferences')
      .select({ view, filterByFormula })
      .all()
      .then(records => records.map(r => this.recordToConference(r)));

    return collect(items);
  }

  public getAllCategories(): Promise<AirtableCategoryDto[]> {
    return this.base('categories')
      .select()
      .all()
      .then(records => records.map(r => this.recordToCategory(r)));
  }

  public async createConference(
    conference: ConferenceDto,
  ): Promise<ConferenceDto> {
    if (this.categories === undefined) {
      this.categories = await this.getAllCategories();
    }
    return this.base('conferences')
      .create(this.cleanConferenceRecord(conference))
      .then(record => this.recordToConference(record));
  }

  public patchConference(
    conference: Partial<ConferenceDto>,
  ): Promise<ConferenceDto> {
    const id = conference.providerId;
    delete conference.providerId;
    return this.base('conferences')
      .update(id, conference)
      .then(record => this.recordToConference(record));
  }

  private cleanConferenceRecord(conference: ConferenceDto): any {
    const categoryArray = [];
    const category = this.categories.find(
      atCategory => atCategory.name === conference.category,
    );
    if (category && category.providerId) {
      categoryArray.push(category.providerId);
    }

    const cleanConferece = {
      ...conference,
      cfp_due_date: conference.cfp_due_date.toDateString(),
      event_start_date: conference.event_start_date.toDateString(),
      category: categoryArray,
    };
    delete cleanConferece.providerId;

    return cleanConferece;
  }

  private recordToCategory(record: any): AirtableCategoryDto {
    return {
      description: record.get('description'),
      name: record.get('name'),
      providerId: record.getId(),
    };
  }

  private recordToConference(record: any): ConferenceDto {
    return {
      category: this.getCategory(record),
      name: record.get('name'),
      provider: this.providerName,
      providerId: record.getId(),
      region: record.get('region') || this.defaultRegion,
      cfp_days_until: record.get('cfp_days_until'),
      cfp_due_date: this.createDateOrUndefined(record.get('cfp_due_date')),
      cfp_start_date: this.createDateOrUndefined(record.get('cfp_start_date')),
      cfp_url: record.get('cfp_url'),
      created_date: this.createDateOrUndefined(record.get('created_date')),
      country: record.get('country'),
      description: record.get('description'),
      event_end_date: this.createDateOrUndefined(record.get('event_end_date')),
      event_start_date: this.createDateOrUndefined(
        record.get('event_start_date'),
      ),
      event_url: record.get('event_url'),
      icon: record.get('icon'),
      is_new: !!record.get('is_new'),
      location: record.get('location'),
      subregion: record.get('subregion'),
      twitter: record.get('twitter'),
      perks_checked: !!record.get('perks_checked'),
      perks_list: this.getPerksList(record),
      travel_covered: !!record.get('travel_covered'),
      hotel_covered: !!record.get('hotel_covered'),
      stipend_covered: !!record.get('stipend_covered'),
      created_days_back: record.get('created_days_back'),
    };
  }

  private createDateOrUndefined(date: string | undefined): Date | undefined {
    return typeof date === 'string' ? new Date(date) : undefined;
  }

  private getCategory(record: any): Category | undefined {
    if (
      record.get('category') &&
      record.get('category')[0] &&
      this.categories !== undefined &&
      this.categories.length > 0
    ) {
      const airtableCategory = this.categories.find(
        atc => atc.providerId === record.get('category')[0],
      );
      return airtableCategory ? airtableCategory.name : this.defaultCategory;
    }

    return undefined;
  }

  private getPerksList(record: any) {
    let result = '';
    if (record.get('perks_checked')) {
      if (record.get('travel_covered')) {
        result += 'Travel, ';
      }
      if (record.get('hotel_covered')) {
        result += 'Hotel, ';
      }
      if (record.get('stipend_covered')) {
        result += 'Stipend, ';
      }
      if (result.length < 2) {
        result = 'None';
      } else {
        result = result.substring(0, result.length - 2);
      }
    } else {
      result = '❓';
    }

    return result;
  }

  private getViewFromOptions(
    options?: AirtableConferenceClientOptionsDto,
  ): string {
    let view = 'all';

    if (options && options.view) {
      view = options.view;
    } else {
      if (options && options.maxDaysUntilCfpEnds) {
        if (options.maxDaysUntilCfpEnds === 21) {
          view = 'closing_in_21';
        } else if (options.maxDaysUntilCfpEnds === 42) {
          view = 'closing_in_42';
        }
      }
    }

    return view;
  }

  private getFilterFormulaFromOptions(
    options?: AirtableConferenceClientOptionsDto,
  ): string {
    if (options && options.recordIds && options.recordIds.length > 0) {
      let response = 'OR(';
      options.recordIds.forEach((recordId, i) => {
        response += `RECORD_ID() = '${recordId}'`;
        response += i === options.recordIds.length - 1 ? '' : ',';
      });
      response += ')';

      return response;
    }

    return '';
  }
}
