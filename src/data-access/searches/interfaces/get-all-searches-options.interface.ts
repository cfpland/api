import { Options } from '../../interfaces/options.interface';
import { Search } from '../entities/search.entity';

export interface GetAllSearchesOptions extends Options<Search> {
  userId: string;
}
