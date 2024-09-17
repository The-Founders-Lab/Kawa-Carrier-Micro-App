import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { AssignOrderDto } from './dto/assign-order.dto';
import { IntegrationKeysEnum } from 'src/webhook/webhook.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(
    @Query('environment') environment: IntegrationKeysEnum,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    page = page || 1;
    pageSize = pageSize || 10;

    return await this.ordersService.findAll({ page, pageSize, environment });
  }

  @Patch('/update-status')
  async updateOrderStatus(
    @Body() update: UpdateOrderDto,
    @Query('environment') environment: IntegrationKeysEnum,
  ) {
    return await this.ordersService.updateStatus({ update, environment });
  }

  @Patch('/assign-rider')
  async assignRiderToOrder(
    @Body() body: AssignOrderDto,
    @Query('environment') environment: IntegrationKeysEnum,
  ) {
    return this.ordersService.assignOrderToRider({
      orderId: body.orderId,
      riderId: body.riderId,
      environment,
    });
  }
}
