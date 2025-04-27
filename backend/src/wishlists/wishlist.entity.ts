import { IsOptional, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Wish } from 'src/wishes/wish.entity';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base-entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @Length(1, 1024)
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
