import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AddExperienceDto {
  @IsString()
  title!: string;

  @IsString()
  company!: string;

  @IsDateString()
  from!: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
