import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TrackingStatus, trackingStatusArray } from '../types/tracking-status.type';
import { AbstractEntity } from '../../abstracts/abstract.entity';

export class CreateTrackedConferenceBodyDto {
  @IsNotEmpty()
  @IsIn(trackingStatusArray)
  public status: TrackingStatus;

  @IsOptional()
  @IsString()
  @Length(0, 999)
  public notes: string;

  @IsOptional()
  @IsArray()
  public abstracts: AbstractEntity[];
}
