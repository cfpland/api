/* tslint:disable:variable-name*/
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchOptionsDto {
  @IsOptional()
  @IsString()
  public category?: string;

  @IsOptional()
  @IsString()
  public region?: string;

  @IsOptional()
  @IsBoolean()
  public hotel_covered?: boolean;

  @IsOptional()
  @IsBoolean()
  public travel_covered?: boolean;

  @IsOptional()
  @IsBoolean()
  public stipend_covered?: boolean;

  @IsOptional()
  @IsString()
  public event_start_date_after?: string;

  @IsOptional()
  @IsString()
  public event_start_date_before?: string;
}
