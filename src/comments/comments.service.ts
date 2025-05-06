import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto, cardId: number) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      card: { id: cardId },
    });
    return this.commentsRepository.save(comment);
  }

  async findCommentsByCardId(cardId: number) {
    return this.commentsRepository.find({ where: { card: { id: cardId } } });
  }

  async findCommentById(id: number) {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['card'],
    });
  }

  async update(id: number, updateCommentDto: CreateCommentDto) {
    const comment = await this.findCommentById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentsRepository.save({ id, ...updateCommentDto });
  }

  async delete(id: number) {
    const result = await this.commentsRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
