import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import {
  UserConferenceAction,
  userConferenceActionsArray,
} from '../types/user-conference-action.type';

export class CreateUserConferenceParamDto {
  @IsNotEmpty()
  @IsString()
  public atConferenceId: string;

  @IsNotEmpty()
  @IsIn(userConferenceActionsArray)
  public action: UserConferenceAction;
}
