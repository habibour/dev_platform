import { IsString, MinLength } from 'class-validator';

export class AddSkillDto {
  @IsString()
  @MinLength(1)
  skill!: string;
}
