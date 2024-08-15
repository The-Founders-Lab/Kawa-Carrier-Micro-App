import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { AssignOrderDto } from './dto/assign-order.dto';

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
  async assignRiderToOrder(@Body() body: AssignOrderDto) {
    return this.ordersService.assignOrderToRider(body.orderId, body.riderId);
  }
}
