import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserAbstractDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  @IsString()
  public other: string;
}
