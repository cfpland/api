import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTrackedConferenceBodyDto {
  @IsOptional()
  @IsString()
  @Length(0, 999)
  public notes: string;
}
