import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
