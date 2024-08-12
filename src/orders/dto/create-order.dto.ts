import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateOrderDto {
  // @IsObject()
  // @IsNotEmpty()
  // orderDetails: object;
  //
  @IsString()
  orderId: string;

  @IsObject()
  @IsNotEmpty()
  data: object;
}
