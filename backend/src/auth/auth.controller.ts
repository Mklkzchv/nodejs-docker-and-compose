import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthUserId } from '../common/decorators/user.decorator';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from '../common/guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@AuthUserId() userId: number) {
    return this.authService.login(userId);
  }

  @Post('signup')
  @UseFilters(ValidationExceptionFilter)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
