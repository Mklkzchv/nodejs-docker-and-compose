import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishesService } from 'src/wishes/wishes.service';
import { Wishlist } from './wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish])],
  controllers: [WishlistsController],
  providers: [WishlistsService, WishesService],
})
export class WishlistsModule {}
