import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider) private ridersRepository: Repository<Rider>,
  ) {}

  getRiders() {
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
