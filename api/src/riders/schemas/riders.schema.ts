import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    type: Boolean,
    default: true,
  })
  available: boolean;
}

export type RidersDocument = HydratedDocument<Riders>;
export const RidersSchema = SchemaFactory.createForClass(Riders);
