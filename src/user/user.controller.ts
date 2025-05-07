import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Создание пользователя' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() user: CreateUserDto): Promise<User> {
    return plainToInstance(
      User,
      await this.userService.create(<User>{
        email: user.email,
        password: user.password,
      }),
    );
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователя по id' })
  async findOne(
    @Param('userId', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.OK).json(plainToInstance(User, user));
  }
}
