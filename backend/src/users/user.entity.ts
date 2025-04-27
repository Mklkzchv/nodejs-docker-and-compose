import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Wish } from '../wishes/wish.entity';
import { Wishlist } from '../wishlists/wishlist.entity';
import { Offer } from '../offers/offer.entity';
import { Length, IsEmail, IsUrl } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 300)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
