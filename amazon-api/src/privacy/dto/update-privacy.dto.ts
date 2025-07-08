import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePrivacyDto {
    @IsNotEmpty()
    @IsString()
    content: string;
}
