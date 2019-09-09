import { Injectable, Logger } from '@nestjs/common';
import { ConferenceDto } from '../dtos/conference.dto';
import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { CallingAllPapersClientService } from '../clients/calling-all-papers-client.service';
import { ConfstechClientService } from '../clients/confstech-client.service';
import { deduplicate } from '../../../shared/functions/deduplicate';
import { collect } from '../../../shared/functions/collect';
import { ConferencesClientInterface } from '../clients/conferences-client.interface';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class ExternalConferencesService {
  private clients: ConferencesClientInterface[] = [];

  constructor(
    private readonly callingAllPapersClient: CallingAllPapersClientService,
    private readonly confstechClient: ConfstechClientService,
  ) {
    this.clients = [callingAllPapersClient, confstechClient];
  }

  public async getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>> {
    let results = [];

    for (const client of this.clients) {
      try {
        const result = await client.getAllConferences(options);
        results = results.concat(result.items);
      } catch (e) {
        Logger.error(
          `Client for "${client.providerName}" could not fetch items.`,
        );
        Logger.log(e.message);
      }
    }

    return this.generateCollection(results);
  }

  private generateCollection(
    conferences: ConferenceDto[],
  ): Collection<ConferenceDto> {
    const items = deduplicate<ConferenceDto>(conferences, 'event_url');

    return collect(items);
  }
}
