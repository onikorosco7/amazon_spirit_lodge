import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsIn(['user', 'admin'])
  sender: 'user' | 'admin';

  @IsNotEmpty()
  @IsString()
  content: string;
}
