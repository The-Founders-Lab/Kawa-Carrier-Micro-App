import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../schemas/booking.schema';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
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
