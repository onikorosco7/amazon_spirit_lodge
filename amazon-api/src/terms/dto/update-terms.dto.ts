import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTermsDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
