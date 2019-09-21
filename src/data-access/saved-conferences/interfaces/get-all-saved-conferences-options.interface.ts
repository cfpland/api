import { Options } from '../../interfaces/options.interface';
import { SavedConference } from '../entities/saved-conference.entity';

export interface GetAllSavedConferencesOptions extends Options<SavedConference> {
  atConferenceId?: string;
  userId?: string;
}
