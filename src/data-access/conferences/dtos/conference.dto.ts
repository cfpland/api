import { Region } from '../../../shared/types/region';
import { Category } from '../../../shared/types/category';

export interface ConferenceDto {
  category?: Category;
  cfp_days_until?: number;
  cfp_due_date?: Date;
  cfp_start_date?: Date;
  cfp_url?: string;
  created_date?: Date;
  country?: string;
  description?: string;
  event_end_date?: Date;
  event_start_date?: Date;
  event_url?: string;
  icon?: any;
  is_new?: boolean;
  location?: string;
  name: string;
  provider: string;
  providerId?: string;
  region?: Region;
  subregion?: string;
  twitter?: string;
  perks_checked?: boolean;
  perks_list?: string;
  travel_covered?: boolean;
  hotel_covered?: boolean;
  stipend_covered?: boolean;
  created_days_back?: number;
}

export interface NewConferenceDto extends ConferenceDto {
  name: string;
  category: Category;
  event_url: string;
  provider: string;
}
