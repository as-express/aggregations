import { IsNotEmpty, MinLength } from 'class-validator';

export class userDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'Password must be min 8' })
  password: string;
}
