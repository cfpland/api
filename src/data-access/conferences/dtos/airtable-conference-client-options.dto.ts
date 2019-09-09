import { ConferenceClientOptionsDto } from './conference-client-options.dto';

export interface AirtableConferenceClientOptionsDto
  extends ConferenceClientOptionsDto {
  recordIds?: string[];
  view?: string;
}
