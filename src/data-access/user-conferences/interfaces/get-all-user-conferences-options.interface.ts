import { Options } from '../../interfaces/options.interface';
import { UserConference } from '../entities/user-conference.entity';

export interface GetAllUserConferencesOptions extends Options<UserConference> {
  atConferenceId?: string;
  userId?: string;
}
