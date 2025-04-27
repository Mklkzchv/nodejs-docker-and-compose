import { compare, hash, genSalt } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async getHash(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async verifyHash(password: string, hash: string) {
    return await compare(password, hash);
  }
}
