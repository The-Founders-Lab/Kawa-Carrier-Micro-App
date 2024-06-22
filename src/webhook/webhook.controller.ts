import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from 'src/booking/booking.service';
import { CreateBookingDto } from 'src/booking/dto/create-booking.dto';
import { BookingStatus } from 'src/booking/schemas/booking.schema';

@Controller('carrier-webhook')
export class WebhookController {
  constructor(private bookingService: BookingService) {}

  @Post('/send')
  async getBooking(@Body() createBookingDto: CreateBookingDto) {
    const { orderId, ...orderDetails } = createBookingDto;
    const booking = await this.bookingService.create({
      orderId,
      orderDetails,
    });
    return {
      data: booking,
    };
  }

  @Post('/update/:bookingId')
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body('status') newStatus: BookingStatus,
  ) {
    if (!Object.values(BookingStatus).includes(newStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const booking = await this.bookingService.findOne(bookingId);
    if (booking == null) {
      throw new BadRequestException('Booking not found');
    }

    const update = await this.bookingService.update(booking.id, {
      status: newStatus,
    });

    await fetch('https://webhook.site/238dddcf-ab4d-4c05-a09c-1fe6b03e24c5', {
      method: 'POST',
      body: JSON.stringify({
        status: update.status,
        orderId: update.orderId,
      }),
    });

    return {
      status: update.status,
      orderId: update.orderId,
    };
  }
}
