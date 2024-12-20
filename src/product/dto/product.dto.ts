import { IsNotEmpty } from 'class-validator';

export class productDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  color: string[];

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  categoryId: string;
}
