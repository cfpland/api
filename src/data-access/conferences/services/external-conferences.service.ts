import { Injectable, Logger } from '@nestjs/common';
import { ConferenceDto } from '../dtos/conference.dto';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { CallingAllPapersClientService } from '../clients/calling-all-papers-client.service';
import { collect } from '../../../shared/functions/collect';
import { ConferencesClientInterface } from '../clients/conferences-client.interface';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class ExternalConferencesService {
  private client: ConferencesClientInterface;

  constructor(
    private readonly callingAllPapersClient: CallingAllPapersClientService,
  ) {
    this.client = callingAllPapersClient;
  }

  public async getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    let results;

    try {
      const data = await this.client.getAllConferences(options);
      results = data.items;
    } catch (e) {
      Logger.error(
        `Client for "${this.client.providerName}" could not fetch items.`,
      );
      Logger.log(e.message);
    }

    return collect(results);
  }
}
