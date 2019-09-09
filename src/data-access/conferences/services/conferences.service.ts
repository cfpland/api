import { Injectable, Logger } from '@nestjs/common';
import { ConferenceDto, NewConferenceDto } from '../dtos/conference.dto';
import { AirtableConferencesClientService } from '../clients/airtable-conferences-client.service';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { ExternalConferencesService } from './external-conferences.service';
import { collect } from '../../../shared/functions/collect';
import { ConferenceQueryParamsDto } from '../validation/conference-query-params.dto';
import { AirtableConferenceClientOptionsDto } from '../dtos/airtable-conference-client-options.dto';
import { Category } from '../../../shared/types/category';
import { Region } from '../../../shared/types/region';
import { Collection } from '../../interfaces/collection.interface';

interface ConferenceFilters {
  category?: Category;
  region?: Region;
}

@Injectable()
export class ConferencesService {
  constructor(
    private readonly internalConferencesClient: AirtableConferencesClientService,
    private readonly externalConferencesService: ExternalConferencesService,
  ) {}

  public async getInternal(
    queryParams: ConferenceQueryParamsDto,
  ): Promise<Collection<ConferenceDto>> {
    const options = this.extractAirtableClientOptionsFromQueryParams(
      queryParams,
    );
    const filters = this.extractFiltersFromQueryParams(queryParams);

    let conferences = (await this.internalConferencesClient.getAllConferences(
      options,
    )).items;

    if (filters.category !== undefined) {
      conferences = conferences.filter(
        conference => conference.category === queryParams.category,
      );
    }

    if (filters.region !== undefined) {
      conferences = conferences.filter(
        conference => conference.region === queryParams.region,
      );
    }

    return collect(conferences);
  }

  public allInternal(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    return this.internalConferencesClient.getAllConferences(options);
  }

  public allExternal(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto | NewConferenceDto>> {
    return this.externalConferencesService.getAllConferences(options);
  }

  public async allNewExternal(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    const savedConferences = await this.allInternal(options);

    const externalConferences = await this.allExternal({
      maxDaysUntilCfpEnds: 42,
    });

    return this.filterExistingConferences(
      externalConferences,
      savedConferences,
    );
  }

  public async createMany(
    conferences: Collection<ConferenceDto>,
  ): Promise<Collection<ConferenceDto>> {
    const savedConferences = [];
    for (const conference of conferences.items) {
      savedConferences.push(await this.create(conference));
    }
    savedConferences.filter(i => i !== undefined);

    return collect(savedConferences);
  }

  public async create(conference: ConferenceDto): Promise<ConferenceDto> {
    try {
      return await this.internalConferencesClient.createConference(conference);
    } catch (e) {
      Logger.error('Conference record could not be saved');
      Logger.error(e);

      return undefined;
    }
  }

  public async update(
    conference: Partial<ConferenceDto>,
  ): Promise<ConferenceDto> {
    try {
      return await this.internalConferencesClient.patchConference(conference);
    } catch (e) {
      Logger.error('Conference record could not be saved');
      Logger.error(e);

      return undefined;
    }
  }

  private filterExistingConferences(
    original: Collection<ConferenceDto>,
    toFilter: Collection<ConferenceDto>,
  ): Collection<ConferenceDto> {
    const items = original.items.filter(originalItem => {
      return !toFilter.items.find(
        filterItem => filterItem.event_url === originalItem.event_url,
      );
    });

    return collect(items);
  }

  private extractFiltersFromQueryParams = (
    query: ConferenceQueryParamsDto,
  ): ConferenceFilters => ({
    category: query.category,
    region: query.region,
  });

  private extractAirtableClientOptionsFromQueryParams = (
    query: ConferenceQueryParamsDto,
  ): AirtableConferenceClientOptionsDto => ({
    view: query.atView,
    recordIds: query.atIds,
  });
}
