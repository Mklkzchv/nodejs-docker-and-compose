import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './offer.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const { itemId, amount } = createOfferDto;
    const associatedWish = await this.wishesService.findById(itemId);

    if (associatedWish.owner.id === user.id) {
      throw new BadRequestException('You cannot contribute to your own wish');
    }

    const updatedRaisedAmount = associatedWish.raised + amount;

    if (updatedRaisedAmount > associatedWish.price) {
      throw new BadRequestException(
        'The specified contribution exceeds the remaining required amount',
      );
    }

    const transactionManager = this.dataSource.createQueryRunner();
    await transactionManager.connect();
    await transactionManager.startTransaction();

    try {
      await this.wishesService.updateRaised(itemId, updatedRaisedAmount);
      const offer = await this.offerRepository.save({
        ...createOfferDto,
        user,
        item: associatedWish,
      });
      return offer;
    } catch (error) {
      await transactionManager.rollbackTransaction();
      throw error;
    } finally {
      await transactionManager.release();
    }
  }

  async findOne(id: number) {
    const offerDetails = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offerDetails) {
      throw new NotFoundException('Offer not found');
    }

    return offerDetails;
  }

  async findAll() {
    const allOffers = await this.offerRepository.find({
      relations: ['item', 'user'],
    });
    return allOffers || [];
  }
}
