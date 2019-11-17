import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserCommunicationPreferencesDto } from './user-communication-preferences.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  locationPoint?: string;

  @IsOptional()
  @IsString()
  speakingGoal?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserCommunicationPreferencesDto)
  public communicationPreferences?: UserCommunicationPreferencesDto;
}
