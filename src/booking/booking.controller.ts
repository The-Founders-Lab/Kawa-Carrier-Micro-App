import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Request } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request,
  ) {
    const booking = await this.bookingService.create(createBookingDto);
    const response = {
      data: booking,
      trackingURL: `${req.protocol}://${req.get('host')}/webhook/track/${booking.id}`,
      updateMethod: 'POST',
    };
    // alert third party
    await fetch('https://webhook.site/9300e61d-8fb9-479e-bb57-93f19894ac5d', {
      method: 'POST',
      body: JSON.stringify(response),
    });
    return response;
  }

  @Get()
  async findAll() {
    const bookings = await this.bookingService.findAll();
    return { data: bookings };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
