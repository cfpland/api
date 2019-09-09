import { IsOptional, ValidateNested } from 'class-validator';
import { UserConferenceMetaDto } from './user-conference-meta.dto';
import { Type } from 'class-transformer';

export class CreateUserConferenceBodyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserConferenceMetaDto)
  public meta?: UserConferenceMetaDto;
}
