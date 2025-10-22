import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCreditsDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;
}
