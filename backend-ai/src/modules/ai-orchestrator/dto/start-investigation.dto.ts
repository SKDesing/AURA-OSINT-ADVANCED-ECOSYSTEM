import { IsString, IsNotEmpty } from 'class-validator';

export class StartInvestigationDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}