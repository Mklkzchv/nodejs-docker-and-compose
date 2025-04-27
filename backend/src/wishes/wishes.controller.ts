import {
  Controller,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { OfferInterceptor } from 'src/common/interceptors/offer.interceptor';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser, AuthUserId } from '../common/decorators/user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @UseInterceptors(PasswordInterceptor)
  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @UseInterceptors(PasswordInterceptor)
  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseInterceptors(PasswordInterceptor, OfferInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseFilters(ValidationExceptionFilter)
  update(
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() userId: number,
  ) {
    return this.wishesService.update(wishId, updateWishDto, userId);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') wishId: number, @AuthUserId() userId: number) {
    return this.wishesService.remove(wishId, userId);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.copy(wishId, user);
  }
}
