import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common/exceptions';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { appErrors } from 'src/utils/app-errors';

class UpdateUserDto {
  username?: string;
  about?: string;
  avatar?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }
    const hashedPassword = await this.hashService.getHash(password);
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  // Поиск одного пользователя по условию
  async findOne(query: string) {
    const user = await this.userRepository.findOne({
      where: { username: query },
    });
    if (!user) {
      throw new NotFoundException(appErrors.USER_NOT_FOUND);
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(appErrors.USER_NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }
    if (password) {
      updateUserDto.password = await this.hashService.getHash(password);
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async findOwnWishes(id: number) {
    const userWishes = await this.userRepository.findOne({
      where: { id },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });
    return userWishes.wishes || [];
  }

  async findWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });
    if (!user) {
      throw new NotFoundException(appErrors.USER_NOT_FOUND);
    }
    return user.wishes || [];
  }

  // Метод для поиска пользователей по имени или email
  findMany(query: FindUserDto) {
    return (
      this.userRepository.find({
        where: [
          { username: Like(`%${query.query}%`) },
          { email: Like(`%${query.query}%`) },
        ],
      }) || []
    );
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async updateOne(user: User, dto: UpdateUserDto) {
    const { id } = user;
    const { email, username } = dto;
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    const isExist = (await this.userRepository.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;
    if (isExist) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }
    try {
      await this.userRepository.update(id, dto);
      const { password, ...updUser } = await this.userRepository.findOneBy({
        id,
      });
      return updUser;
    } catch (_) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
  }

  // Удаление одного пользователя
  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id); // Удаление из БД
  }
}
