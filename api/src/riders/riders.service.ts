import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CreateRiderDto } from './dtos/create-rider.dto';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider) private ridersRepository: Repository<Rider>,
  ) {}

  createRider() {
    const newRider = this.ridersRepository.create({
      riderImage: '',
      riderFirstName: faker.person.firstName(),
      riderLastName: faker.person.lastName(),
      riderPhone: faker.phone.number({ style: 'human' }),
      vehiclePlate: faker.vehicle.vin(),
      vehicleBrand: faker.vehicle.vehicle(),
      vehicleModel: faker.vehicle.model(),
      color: faker.vehicle.color(),
      vehicleType: faker.vehicle.type(),
    });
    return this.ridersRepository.save(newRider);
  }

  async getRiders() {
    return this.ridersRepository.find();
  }

  findRider(riderId: string) {
    return this.ridersRepository.findOneBy({ _id: riderId });
  }

  updateRiderStatus(riderId: string, status: boolean) {
    return this.ridersRepository.update(
      { _id: riderId },
      { available: status },
    );
  }
}
