import { IsUUID } from 'class-validator';

export class AssignOrderDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  riderId: string;
}
