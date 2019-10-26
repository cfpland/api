import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserCommunicationPreferencesDto } from './user-communication-preferences.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public auth0UserId: string;

  @IsOptional()
  public firstName?: string;

  @IsOptional()
  public lastName?: string;

  @IsOptional()
  public twitter?: string;

  @IsOptional()
  public website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  speakingGoal?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserCommunicationPreferencesDto)
  public communicationPreferences?: UserCommunicationPreferencesDto;
}
