/* tslint:disable:variable-name*/
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class SearchOptionsDto {
  @IsOptional()
  @IsString()
  public category?: string;

  @IsOptional()
  @IsString()
  public region?: string;

  @IsOptional()
  @IsBooleanString()
  public hotel_covered?: boolean;

  @IsOptional()
  @IsBooleanString()
  public travel_covered?: boolean;

  @IsOptional()
  @IsBooleanString()
  public stipend_covered?: boolean;

  @IsOptional()
  @IsString()
  public event_start_date_after?: string;

  @IsOptional()
  @IsString()
  public event_start_date_before?: string;
}
