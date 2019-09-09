import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserCommunicationPreferencesDto } from './user-communication-preferences.dto';
import {
  UserAccountLevel,
  userAccountLevelsArray,
} from '../types/user-account-level.type';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public auth0UserId: string;

  @IsIn(userAccountLevelsArray)
  accountLevel: UserAccountLevel;

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
