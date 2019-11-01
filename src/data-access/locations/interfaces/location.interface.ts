import { Region } from '../../../shared/types/region';

export interface Location {
  city?: string;
  country: string;
  friendlyName: string;
  latitude?: number;
  longitude?: number;
  region: Region;
  subregion: string;
}
