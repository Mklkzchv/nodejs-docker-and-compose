import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsNumber()
  @Min(0)
  @IsOptional()
  raised: number;
}
