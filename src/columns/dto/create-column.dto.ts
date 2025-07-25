import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
