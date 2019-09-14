import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TrackingStatus, trackingStatusArray } from '../types/tracking-status.type';

export class CreateTrackedConferenceBodyDto {
  @IsNotEmpty()
  @IsIn(trackingStatusArray)
  public status: TrackingStatus;

  @IsOptional()
  @IsString()
  @Length(0, 999)
  public notes: string;
}
