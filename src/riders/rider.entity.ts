import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  riderImage: string;

  @Column()
  riderFirstName: string;

  @Column()
  riderLastName: string;

  @Column({ unique: true })
  riderPhone: string;

  @Column()
  vehiclePlate: string;

  @Column()
  vehicleBrand: string;

  @Column()
  vehicleModel: string;

  @Column()
  color: string;

  @Column()
  vehicleType: string;

  @Column({
    type: Boolean,
    default: true,
  })
  available: boolean;
}
