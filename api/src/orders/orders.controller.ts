import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './schemas/orders.schema';
import { OrdersService } from './orders.service';
import config from 'src/config';

@Controller('orders')
export class OrdersController {
  public readonly riders = [
    {
      id: 'e4cf8f47-f47d-4ae0-9701-de2e6bafdaeb',
      riderImage: null,
      driverName: 'Adamu Chibueze',
      email: 'adamu@mailnator.com',
      phoneNumber: '+2348044905421',
      stateOfOrigin: 'Benue State',
      licenseType: 'TYPE II',
      licenseNumber: '23FBRT567',
      dlImageLink: null,
      ninNumber: '435680092347',
      isBlock: false,
      isActivated: false,
      riderStatus: 'available',
      riderAddress: 'Ikeja',
      riderState: 'Lagos',
      riderCountry: 'Nigeria',
      createdAt: '2023-06-07T09:28:04.633Z',
      vehicleId: '40df5ad4-e3b6-48f3-a08f-22a0e77e01ab',
    },
    {
      id: '4dac84b7-d720-4567-b11f-80d3e06531c9',
      riderImage: null,
      driverName: 'Victor Okoye',
      email: 'cexiley697@anwarb.com',
      phoneNumber: '+2348054905321',
      stateOfOrigin: 'Benue State',
      licenseType: 'TYPE II',
      licenseNumber: '23FlRT527',
      dlImageLink: null,
      ninNumber: '4356810922347',
      isBlock: false,
      isActivated: true,
      riderStatus: 'available',
      riderAddress: 'Ikeja',
      riderState: 'Lagos',
      riderCountry: 'Nigeria',
      createdAt: '2023-06-23T12:25:39.588Z',
      vehicleId: '3f38aab1-3f8a-4b03-93d9-e93c4e42df30',
    },
  ];
  constructor(private readonly ordersService: OrdersService) {}

  @Patch('/update/:orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() update: UpdateOrderDto,
  ) {
    if (!Object.values(OrderStatus).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const order = await this.ordersService.findOne(orderId);
    if (order == null) {
      throw new BadRequestException('Order not found');
    }

    try {
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
        await this.ordersService.update(order.id, {
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
    } catch (error) {
      console.log('Error updating order', error);
      return error;
    }
  }
}
