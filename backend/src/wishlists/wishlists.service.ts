import {
  NotFoundException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { appErrors } from 'src/utils/app-errors';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = await this.wishesService.getManyByIds(itemsId);

    const wishlist = await this.wishlistRepository.save({
      items,
      owner: user,
      ...rest,
    });
    return wishlist;
  }

  async findById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(appErrors.ERROR_WISHLIST);
    }
    return wishlist;
  }

  findAll() {
    return (
      this.wishlistRepository.find({
        relations: ['owner', 'items'],
      }) || []
    );
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner'],
    });

    if (!wishlist) {
      throw new NotFoundException(appErrors.ERROR_WISHLIST);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wishlist');
    }
    await this.wishlistRepository.delete(wishlistId);
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException(appErrors.ERROR_WISHLIST);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wishlist');
    }
    const { itemsId, name, image, description } = updateWishlistDto;
    const wishes = await this.wishesService.getManyByIds(itemsId || []);

    await this.wishlistRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: wishes,
    });
    return await this.findById(id);
  }
}
