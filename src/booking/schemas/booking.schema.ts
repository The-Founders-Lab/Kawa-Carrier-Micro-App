import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum OrderStatus {
  start = 'start',
  pickup = 'pickup',
  delivered = 'delivered',
  delayed = 'delayed',
}

@Schema()
export class Booking {
  // @Prop({ default: BookingStatus.Pending, enum: BookingStatus })
  // status: String;
  //
  @Prop()
  orderId: String;
  //
  // @Prop({ required: true, type: Object })
  // orderDetails: Object;

  @Prop({ required: true, type: Object })
  data: Object;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
