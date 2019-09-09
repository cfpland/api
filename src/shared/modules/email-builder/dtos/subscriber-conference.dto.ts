import { ConferenceDto } from '../../../../data-access/conferences/dtos/conference.dto';

export interface SubscriberConferenceDto extends ConferenceDto {
  preferred: boolean;
}
