import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserConferenceParamDto {
  @IsNotEmpty()
  @IsString()
  public atConferenceId: string;
}
