import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum Status {
  pending = 'pending',
  delivered = 'delivered',
  canceled = 'canceled',
}

export class statusDto {
  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
