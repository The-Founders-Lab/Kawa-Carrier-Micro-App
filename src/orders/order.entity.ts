import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn({ nullable: false, unique: true })
  orderId: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, object | string>;

  @CreateDateColumn()
  createdAt: Date;
}
