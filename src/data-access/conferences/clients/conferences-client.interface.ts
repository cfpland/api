import { ConferenceClientOptionsDto } from '../dtos/conference-client-options.dto';
import { ConferenceDto } from '../dtos/conference.dto';
import { ConferenceProvider } from '../../../shared/types/conference-provider';
import { Collection } from '../../interfaces/collection.interface';

export interface ConferencesClientInterface {
  readonly providerName: ConferenceProvider;

  getAllConferences(
    options?: ConferenceClientOptionsDto,
  ): Promise<Collection<ConferenceDto>>;
}
