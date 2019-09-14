import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { TrackingStatus, trackingStatusArray } from '../types/tracking-status.type';

export class CreateTrackedConferenceParamDto {
  @IsNotEmpty()
  @IsString()
  public atConferenceId: string;

  @IsNotEmpty()
  @IsIn(trackingStatusArray)
  public status: TrackingStatus;
}
