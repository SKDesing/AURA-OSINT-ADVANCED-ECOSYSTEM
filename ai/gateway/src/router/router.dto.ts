import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RouterDecisionDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsNumber()
  lexical_score?: number;

  @IsOptional()
  @IsString()
  language?: string;
}

export class RouterDiagnoseDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  expected_algorithm?: string;
}