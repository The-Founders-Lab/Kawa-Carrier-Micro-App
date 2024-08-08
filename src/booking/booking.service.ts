import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './schemas/booking.schema';
import { Model } from 'mongoose';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    return this.bookingModel.create(createBookingDto);
  }

  findAll() {
    return this.bookingModel.find();
  }

  findOne(id: string) {
    return this.bookingModel.findById(id);
  }

  findByOrderId(orderId: string) {
    return this.bookingModel.findOne({ orderId: orderId });
  }

  updateByOrderId(orderId: string, update: Partial<UpdateBookingDto>) {
    return this.bookingModel.findByIdAndUpdate(orderId, update, {
      new: true,
    });
  }

  remove(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }
}
