import { Module } from '@nestjs/common';
import { Wish } from '../wishes/wish.entity';
import { Offer } from './offer.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish])],
  controllers: [OffersController],
  providers: [OffersService, WishesService],
})
export class OffersModule {}
