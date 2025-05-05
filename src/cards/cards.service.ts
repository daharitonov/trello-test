import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsEntity } from './cards.entity';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardsEntity)
    private columnsRepository: Repository<CardsEntity>,
  ) {}

  async findCardById(id: number): Promise<CardsEntity | null> {
    return this.columnsRepository.findOne({ where: { id } });
  }

  async findCardsByColumnId(columnId: number): Promise<CardsEntity[]> {
    return this.columnsRepository.find({ where: { column: { id: columnId } } });
  }

  async create(
    createCardDto: CreateCardDto,
    columnId: number,
  ): Promise<CardsEntity> {
    return this.columnsRepository.save({
      ...createCardDto,
      column: { id: columnId },
    });
  }

  async findCardsByColumn(columnId: number): Promise<CardsEntity[]> {
    return this.columnsRepository.find({ where: { column: { id: columnId } } });
  }

  async update(id: number, updateCardDto: CreateCardDto): Promise<CardsEntity> {
    return this.columnsRepository.save({ id, ...updateCardDto });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.columnsRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
