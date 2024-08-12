import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum OrderStatus {
  start = 'start',
  pickup = 'pickup',
  delivered = 'delivered',
  delayed = 'delayed',
}

@Schema()
export class Order {
  @Prop({ primary: true, unique: true })
  orderId: String;

  @Prop({ required: true, type: Object })
  data: Object;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
