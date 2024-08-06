import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum BookingStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Processing = 'processing',
  PickedUp = 'picked-up',
  Delivered = 'delivered',
}

@Schema()
export class Booking {
  // @Prop({ default: BookingStatus.Pending, enum: BookingStatus })
  // status: String;
  //
  // @Prop()
  // orderId: String;
  //
  // @Prop({ required: true, type: Object })
  // orderDetails: Object;

  @Prop({ required: true, type: Object })
  data: Object;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
