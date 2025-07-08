import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
