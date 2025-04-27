import { UnauthorizedException, Injectable } from '@nestjs/common';
import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { appErrors } from '../utils/app-errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUserCredentials(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await this.hashService.verifyHash(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException(appErrors.ERROR_REGISTER);
    }
  }

  async login(userID: number) {
    const payload = await this.jwtService.signAsync({ sub: userID });
    return { access_token: payload };
  }
}
