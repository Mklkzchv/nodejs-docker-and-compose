import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { appErrors } from '../../utils/app-errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const authenticatedUser = await this.authService.verifyUserCredentials(
      username,
      password,
    );
    if (!authenticatedUser) {
      throw new UnauthorizedException(appErrors.ERROR_REGISTER);
    }

    return authenticatedUser;
  }
}
