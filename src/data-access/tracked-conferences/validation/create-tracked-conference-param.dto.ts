import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackedConferenceParamDto {
  @IsNotEmpty()
  @IsString()
  public atConferenceId: string;
}
