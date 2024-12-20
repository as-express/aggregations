import { IsNotEmpty, MinLength } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'Password must be min 8' })
  password: string;
}
