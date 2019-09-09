import { Country } from './country.interface';
import { Region } from '../../../shared/types/region';

export interface Location {
  country: Country;
  friendlyName: string;
  region: Region;
  subregion: string;
}
