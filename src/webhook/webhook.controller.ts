import {
  Req,
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from 'src/booking/booking.service';
import { OrderStatus } from 'src/booking/schemas/booking.schema';
import { WebhookService } from './webhook.service';
import config from 'src/config';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';

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
    console.log(body.id);
    const booking = await this.bookingService.create({
      data: body.data,
      orderId: body.data.id,
    });
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

  @Post('/update/:orderId')
  async updateBooking(
    @Param('orderId') orderId: string,
    @Body() update: UpdateBookingDto,
  ) {
    if (!Object.values(OrderStatus).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const order = await this.bookingService.findByOrderId(orderId);
    if (order == null) {
      throw new BadRequestException('Booking not found');
    }

    const resp = await fetch(
      `${config.KAWA_SDK_BASE_URL}/orders/update-order-status`,
      {
        body: JSON.stringify({
          ...update,
          orderId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.KAWA_INTEGRATION_KEY}`,
        },
        method: 'POST',
      },
    );
    const respJson = await resp.json();

    if (respJson.statusCode === 200) {
      await this.bookingService.updateByOrderId(order.id, {
        data: {
          ...order.data,
          orderStatus: update.orderStatus,
        },
      });
    }

    console.log('req', {
      ...update,
      orderId,
    });
    console.log('resp', respJson);
    console.log();

    return { message: respJson?.message || 'updated', data: respJson };
  }
}
