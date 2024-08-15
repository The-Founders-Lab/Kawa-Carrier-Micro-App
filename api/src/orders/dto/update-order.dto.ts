import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatusEnum } from '../order.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @IsNotEmpty()
  orderStatus: OrderStatusEnum;

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
