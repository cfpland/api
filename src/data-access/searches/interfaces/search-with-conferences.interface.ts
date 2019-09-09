import { Search } from '../entities/search.entity';
import { ConferenceDto } from '../../conferences/dtos/conference.dto';
import { Collection } from '../../interfaces/collection.interface';

export interface SearchWithConferences {
  search: Search;
  conferences: Collection<ConferenceDto>;
}
