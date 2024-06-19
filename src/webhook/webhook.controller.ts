import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { BookingService } from 'src/booking/booking.service';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private bookingService: BookingService) {}

  @Get('/track/:bookingId')
  async getBooking(@Param('bookingId') bookingId: string, @Req() req: Request) {
    const castedId = new Types.ObjectId(bookingId).toString();
    if (!isValidObjectId(bookingId) || castedId !== bookingId) {
      throw new BadRequestException('Invalid ID');
    }

    const booking = await this.bookingService.findOne(bookingId);
    if (booking == null) {
      throw new BadRequestException('Booking not found');
    }

    return {
      trackingURL: `${req.protocol}://${req.get('host')}${req.url}`,
      data: booking,
    };
  }

  @Post('/track/:bookingId')
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body('status') newStatus: string,
  ) {
    const castedId = new Types.ObjectId(bookingId).toString();
    if (!isValidObjectId(bookingId) || castedId !== bookingId) {
      throw new BadRequestException('Invalid ID');
    }

    const booking = await this.bookingService.findOne(bookingId);
    if (booking == null) {
      throw new BadRequestException('Booking not found');
    }

    const update = await this.bookingService.update(booking.id, {
      status: newStatus,
    });

    // notify booking api here

    return {
      data: update,
    };
  }
}
