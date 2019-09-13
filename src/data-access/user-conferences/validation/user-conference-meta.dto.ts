import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  TrackingStatus,
  trackingStatusArray,
} from '../../tracked-conferences/types/tracking-status.type';

export class UserConferenceMetaDto {
  @IsOptional()
  @IsIn(trackingStatusArray)
  public trackingStatus?: TrackingStatus;

  @IsOptional()
  @IsString()
  public notes?: string;
}
