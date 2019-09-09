import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SearchOptionsDto } from './search-options.dto';
import { Type } from 'class-transformer';

export class CreateUserSearchDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SearchOptionsDto)
  public options: SearchOptionsDto;
}
