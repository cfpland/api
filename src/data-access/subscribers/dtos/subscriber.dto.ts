import { Region } from '../../../shared/types/region';
import { SubscriberProvider } from '../../../shared/types/subscriber-provider';
import { Category } from '../../../shared/types/category';

export interface SubscriberDto {
  email: string;
  firstName?: string;
  lastName?: string;
  preferredCategory: Category;
  preferredRegion: Region;
  profileLink?: string;
  provider: SubscriberProvider;
  providerId: string;
  twitter?: string;
  unsubscribeLink?: string;
  website?: string;
}
