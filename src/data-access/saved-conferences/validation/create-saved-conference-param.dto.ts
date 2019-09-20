import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedConferenceParamDto {
  @IsNotEmpty()
  @IsString()
  public atConferenceId: string;
}
