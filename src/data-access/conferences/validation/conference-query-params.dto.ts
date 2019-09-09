import { IsArray, IsOptional, IsString } from 'class-validator';
import { Category } from '../../../shared/types/category';
import { Region } from '../../../shared/types/region';

export class ConferenceQueryParamsDto {
  @IsOptional()
  @IsString()
  readonly category?: Category;

  @IsOptional()
  @IsString()
  readonly region?: Region;

  @IsOptional()
  @IsString()
  readonly atView?: string;

  @IsOptional()
  @IsArray()
  readonly atIds?: string[];
}
