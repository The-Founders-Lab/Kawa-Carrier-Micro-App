import {
  Req,
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from 'src/booking/booking.service';
import { BookingStatus } from 'src/booking/schemas/booking.schema';
import { WebhookService } from './webhook.service';
import config from 'src/config';

@Controller('carrier-webhook')
export class WebhookController {
  constructor(
    private bookingService: BookingService,
    private webhookService: WebhookService,
  ) {}

  @Post('/send')
  async getBooking(@Body() body, @Req() req) {
    this.webhookService.verifyDataIsFromKawa(
      req.headers['x-kawa-signature'],
      body,
    );
    const booking = await this.bookingService.create({ data: body });
    console.log({
      message: 'Data saved',
      status: body.data.orderStatus,
      data: booking.data,
    });
    return {
      message: 'Data saved',
      status: body.orderStatus,
    };
  }

  @Post('/update/:bookingId')
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body('status') newStatus: BookingStatus,
  ) {
    // NOTE: this controller is just broilerplate for updating order status
    // ========================================================
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

    await fetch(`${config.KAWA_SDK_BASE_URL}/orders/update-order-status`, {
      method: 'POST',
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    return {
      status: newStatus,
    };
  }
}
