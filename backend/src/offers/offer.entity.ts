import { IsDecimal, Min } from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base-entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column({ default: false })
  hidden: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  amount: number;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
