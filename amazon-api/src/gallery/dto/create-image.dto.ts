import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
