import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';

export interface UserAccountSummaryInterface {
  acceptedCfpsCount: number;
  appliedCfpsCount: number;
  openCfpCount: number;
  openCfpSelection: Collection<ConferenceDto>;
  savedCfpsCount: number;
}
