import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders() {
    return await this.ordersService.findAll();
  }

  @Patch('/update-status')
  async updateOrderStatus(@Body() update: UpdateOrderDto) {
    return await this.ordersService.updateStatus(update);
  }

  @Patch('/assign-rider')
  async assignRiderToOrder(
    @Body('orderId') orderId: string,
    @Body('riderId') riderId: string,
  ) {
    return this.ordersService.assignOrderToRider(orderId, riderId);
  }
}
