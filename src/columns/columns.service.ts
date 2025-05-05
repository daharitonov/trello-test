import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './columns.entity';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnsRepository: Repository<ColumnEntity>,
  ) {}

  async create(column: CreateColumnDto, userId: number): Promise<ColumnEntity> {
    return this.columnsRepository.save({ ...column, user: { id: userId } });
  }

  async updateById(id: number, column: CreateColumnDto): Promise<ColumnEntity> {
    return this.columnsRepository.save({ id, ...column });
  }

  async findColumnsByUser(userId: number): Promise<ColumnEntity[]> {
    return this.columnsRepository.find({ where: { user: { id: userId } } });
  }

  async findColumnById(id: number): Promise<ColumnEntity | null> {
    return this.columnsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async deleteColumn(id: number): Promise<void> {
    await this.columnsRepository.delete(id);
  }
}
