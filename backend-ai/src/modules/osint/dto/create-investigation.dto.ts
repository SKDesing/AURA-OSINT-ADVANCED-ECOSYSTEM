import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsEnum, IsString, IsUrl } from 'class-validator';
import { InvestigationDepth } from '../entities/investigation.entity';

export class CreateInvestigationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ip_address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bitcoin_address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ethereum_address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  custom_target?: string;

  @ApiProperty({ enum: InvestigationDepth, default: 'medium' })
  @IsOptional()
  @IsEnum(InvestigationDepth)
  depth?: InvestigationDepth;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}