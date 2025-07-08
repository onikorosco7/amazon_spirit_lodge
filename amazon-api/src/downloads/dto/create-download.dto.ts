import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDownloadDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
