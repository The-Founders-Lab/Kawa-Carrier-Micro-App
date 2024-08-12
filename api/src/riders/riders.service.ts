import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Riders, RidersDocument } from './schemas/riders.schema';
import { Model } from 'mongoose';

@Injectable()
export class RidersService {
  constructor(
    @InjectModel(Riders.name) private readonly ridersModel: Model<Riders>,
  ) {}

  getRiders() {
    return this.ridersModel.find({});
  }

  findRider(riderId: string): Promise<RidersDocument> {
    return this.ridersModel.findById(riderId);
  }

  updateRiderStatus(riderId: string, status: boolean) {
    return this.ridersModel.findByIdAndUpdate(
      riderId,
      { available: status },
      { new: true },
    );
  }
}
