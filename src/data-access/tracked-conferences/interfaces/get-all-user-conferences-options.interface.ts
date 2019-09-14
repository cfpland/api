import { Options } from '../../interfaces/options.interface';
import { TrackedConference } from '../tracked-conference.entity';

export interface GetAllTrackedConferencesOptions extends Options<TrackedConference> {
  atConferenceId?: string;
  userId?: string;
}
