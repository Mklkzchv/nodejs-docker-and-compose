import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { ValidationExceptionFilter } from 'src/common/filters/validation-exception.filter';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser, AuthUserId } from '../common/decorators/user.decorator';

@UseInterceptors(PasswordInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseFilters(ValidationExceptionFilter)
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findById(id);
  }

  @Patch(':id')
  @UseFilters(ValidationExceptionFilter)
  update(
    @Param('id') wishId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUserId() userId: number,
  ) {
    return this.wishlistsService.update(wishId, updateWishlistDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') wishId: number, @AuthUserId() userId: number) {
    return this.wishlistsService.remove(wishId, userId);
  }
}
