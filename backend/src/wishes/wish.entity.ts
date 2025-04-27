import { User } from 'src/users/user.entity';
import { BaseEntity } from 'src/common/base-entity';
import { Offer } from 'src/offers/offer.entity';
import { IsInt, IsNumber, IsUrl, Length, Min } from 'class-validator';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
