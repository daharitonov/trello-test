import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { Response } from 'express';
import { ColumnEntity } from './columns.entity';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users/:userId/columns')
@ApiBearerAuth()
export class ColumnsController {
  constructor(
    private columnsService: ColumnsService,
    private userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создание колонки' })
  async createColumn(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateColumnDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    const column = await this.columnsService.create(dto, userId);
    return res.status(HttpStatus.CREATED).json(column);
  }

  @Get()
  @ApiOperation({ summary: 'Получение колонок пользователя' })
  async findColumns(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    const columns = await this.columnsService.findColumnsByUser(userId);
    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(ColumnEntity, columns));
  }

  @Get(':columnId')
  @ApiOperation({ summary: 'Колонка по Id' })
  async findColumn(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Res() res: Response,
  ) {
    const column = await this.columnsService.findColumnById(columnId);
    if (!column || column.user?.id !== userId) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Column not found' });
    }

    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(ColumnEntity, column));
  }

  @Delete(':columnId')
  @ApiOperation({ summary: 'Удаление колонки' })
  async deleteColumn(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Res() res: Response,
  ) {
    const column = await this.columnsService.findColumnById(columnId);
    if (!column || column.user?.id !== userId) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Column not found' });
    }

    await this.columnsService.deleteColumn(columnId);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':columnId')
  @ApiOperation({ summary: 'Обновление колонки' })
  async updateColumn(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() dto: CreateColumnDto,
    @Res() res: Response,
  ) {
    const column = await this.columnsService.findColumnById(columnId);
    if (!column || column.user?.id !== userId) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Column not found' });
    }

    const updatedColumn = await this.columnsService.updateById(columnId, dto);
    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(ColumnEntity, updatedColumn));
  }
}
