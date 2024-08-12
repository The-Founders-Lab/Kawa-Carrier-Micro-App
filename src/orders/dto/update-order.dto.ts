import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../schemas/orders.schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @IsNotEmpty()
  orderStatus: OrderStatus;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  orderId: string;

  @IsOptional()
  orderStartCoord?: any;

  @IsOptional()
  riderPickUpCoord?: any;

  @IsNumber()
  @IsOptional()
  deliveryCode?: number;

  @IsOptional()
  riderDropOffCoord?: any;

  @IsOptional()
  @IsString()
  deliveryImageLink?: string;

  @IsBoolean()
  @IsOptional()
  isSdkDemo?: boolean;
}
