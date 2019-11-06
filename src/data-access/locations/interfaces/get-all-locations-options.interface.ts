import { Options } from '../../interfaces/options.interface';
import { Location } from './location.interface';

export interface GetAllLocationsOptions extends Options<Location> {
  search?: string;
}
