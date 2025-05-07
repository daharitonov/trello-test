import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  HttpStatus,
  Res,
  ParseIntPipe,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { CardsService } from 'src/cards/cards.service';
import { CommentsService } from './comments.service';
import { ColumnsService } from 'src/columns/columns.service';
import { CommentsEntity } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private cardsService: CardsService,
    private userService: UserService,
    private columnsService: ColumnsService,
  ) {}

  async validateOwnership(userId: number, columnId: number, cardId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const column = await this.columnsService.findColumnById(columnId);
    if (!column || column.user.id !== userId) {
      throw new NotFoundException(
        'Column not found or does not belong to user',
      );
    }

    const card = await this.cardsService.findCardById(cardId);
    if (!card || card.column.id !== columnId) {
      throw new NotFoundException(
        'Card not found or does not belong to column',
      );
    }

    return card;
  }

  @Post()
  @ApiOperation({ summary: 'Создание комментария' })
  async createComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId, cardId);
    const comment = await this.commentsService.create(createCommentDto, cardId);

    return res
      .status(HttpStatus.CREATED)
      .json(plainToInstance(CommentsEntity, comment));
  }

  @Get()
  @ApiOperation({ summary: 'Получение комментариев по карточке' })
  async getCommentsByCard(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId, cardId);
    const comments = await this.commentsService.findCommentsByCardId(cardId);

    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(CommentsEntity, comments));
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Получение комментария по id' })
  async getCommentById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId, cardId);
    const comment = await this.commentsService.findCommentById(commentId);

    if (!comment) throw new NotFoundException('Comment not found');
    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(CommentsEntity, comment));
  }

  @Put(':commentId')
  @ApiOperation({ summary: 'Обновление комментария' })
  async updateComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId, cardId);
    const comment = await this.commentsService.update(
      commentId,
      updateCommentDto,
    );

    if (!comment) throw new NotFoundException('Comment not found');
    return res
      .status(HttpStatus.OK)
      .json(plainToInstance(CommentsEntity, comment));
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Удаление комментария' })
  async deleteComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Res() res: Response,
  ) {
    await this.validateOwnership(userId, columnId, cardId);
    const deleted = await this.commentsService.delete(commentId);

    if (!deleted) {
      throw new NotFoundException('Comment not found');
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
