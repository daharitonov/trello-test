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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
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

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.OK).json(plainToInstance(User, user));
  }
}
