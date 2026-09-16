import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class AddPortfolioProjectDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  urls!: string[];

  @IsArray()
  @IsString({ each: true })
  technologies!: string[];

  @IsDateString()
  startDate!: string;

  @ValidateIf((dto: AddPortfolioProjectDto) => dto.isCurrent !== true)
  @IsDateString({}, { message: 'endDate is required unless isCurrent is true' })
  endDate?: string;

  @IsBoolean()
  isCurrent!: boolean;
}
