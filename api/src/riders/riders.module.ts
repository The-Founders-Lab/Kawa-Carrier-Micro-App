import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Riders, RidersSchema } from './schemas/riders.schema';
import { RidersController } from './riders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Riders.name, schema: RidersSchema }]),
  ],
  providers: [RidersService],
  controllers: [RidersController],
  exports: [RidersService],
})
export class RidersModule {}
