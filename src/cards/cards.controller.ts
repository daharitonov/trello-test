import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { CardsService } from './cards.service';
import { ColumnsService } from 'src/columns/columns.service';
import { UserService } from 'src/user/user.service';
import { CreateCardDto } from './dto/create-card.dto';
import { plainToInstance } from 'class-transformer';
import { CardsEntity } from './cards.entity';

@Controller('users/:userId/columns/:columnId/cards')
export class CardsController {
  constructor(
    private cardsService: CardsService,
    private columnsService: ColumnsService,
    private userService: UserService,
  ) {}

  async validateOwnership(userId: number, columnId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const column = await this.columnsService.findColumnById(columnId);
    if (!column || column.user.id !== userId) {
      throw new NotFoundException(
        'Column not found or does not belong to user',
      );
    }

    return column;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createCard(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createCardDto: CreateCardDto,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId);
    const card = await this.cardsService.create(createCardDto, columnId);
    return res
      .status(HttpStatus.CREATED)
      .json(plainToInstance(CardsEntity, card));
  }

  @Get()
  async getCardsByColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId);
    const cards = await this.cardsService.findCardsByColumn(columnId);
    return res.status(HttpStatus.OK).json(plainToInstance(CardsEntity, cards));
  }

  @Get(':cardId')
  async getCardById(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId);
    const card = await this.cardsService.findCardById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return res.status(HttpStatus.OK).json(plainToInstance(CardsEntity, card));
  }

  @Put(':cardId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateCard(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() updateCardDto: CreateCardDto,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId);
    const updated = await this.cardsService.update(cardId, updateCardDto);
    if (!updated) {
      throw new NotFoundException('Card not found');
    }
    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(CardsEntity, updated));
  }

  @Delete(':cardId')
  async deleteCard(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId);
    const deleted = await this.cardsService.delete(cardId);
    if (!deleted) {
      throw new NotFoundException('Card not found');
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
