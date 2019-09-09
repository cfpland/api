import { Options } from '../../interfaces/options.interface';
import { UserConference } from '../entities/user-conference.entity';
import { UserConferenceAction } from '../types/user-conference-action.type';

export interface GetAllUserConferencesOptions extends Options<UserConference> {
  action?: UserConferenceAction;
  atConferenceId?: string;
  userId?: string;
}
