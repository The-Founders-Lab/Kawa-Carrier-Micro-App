import { IsOptional, IsString } from 'class-validator';

export class CreateRiderDto {
  @IsString()
  riderImage: string;

  @IsString()
  riderFirstName: string;

  @IsString()
  riderLastName: string;

  @IsString()
  @IsOptional()
  riderPhone: string;

  @IsString()
  vehiclePlate: string;

  @IsString()
  vehicleBrand: string;

  @IsString()
  vehicleModel: string;

  @IsString()
  color: string;

  @IsString()
  vehicleType: string;
}
