import { IsBoolean } from 'class-validator';

export const defaultCommunicationPreferences = {
  savedConferences: true,
  savedSearches: true,
  weeklySummary: true,
};

export class UserCommunicationPreferencesDto {
  @IsBoolean()
  savedConferences?: boolean;

  @IsBoolean()
  savedSearches?: boolean;

  @IsBoolean()
  weeklySummary?: boolean;
}
