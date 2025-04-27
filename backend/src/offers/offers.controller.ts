import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';

@UseInterceptors(PasswordInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() offerData: CreateOfferDto, @AuthUser() currentUser: User) {
    return this.offersService.create(offerData, currentUser);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') offerId: number) {
    return this.offersService.findOne(offerId);
  }
}
