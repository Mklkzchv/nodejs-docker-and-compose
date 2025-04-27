import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtConfigFactory } from '../config/jwt.config';
import { HashModule } from '../hash/hash.module';
import config from '../config/config';

@Module({
  imports: [
    PassportModule,
    HashModule,
    UsersModule,
    JwtModule.registerAsync({ useClass: JwtConfigFactory }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtConfigFactory, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
