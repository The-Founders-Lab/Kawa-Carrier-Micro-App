import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum RiderStatusEnum {
  Available = 'available',
  UnAvailable = 'unavailable',
}

@Schema()
export class Riders {
  @Prop()
  riderImage: string;

  @Prop()
  riderFirstName: string;

  @Prop()
  riderLastName: string;

  @Prop({ unique: true })
  riderPhone: string;

  @Prop()
  vehiclePlate: string;

  @Prop()
  vehicleBrand: string;

  @Prop()
  vehicleModel: string;

  @Prop()
  color: string;

  @Prop()
  vehicleType: string;

  @Prop({
    type: String,
    enum: RiderStatusEnum,
    default: RiderStatusEnum.Available,
  })
  riderStatus: string;
}

export type RidersDocument = HydratedDocument<Riders>;
export const RidersSchema = SchemaFactory.createForClass(Riders);
