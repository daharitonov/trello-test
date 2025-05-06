import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsEntity } from './cards.entity';
import { ColumnsModule } from 'src/columns/columns.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ColumnsModule, UserModule, TypeOrmModule.forFeature([CardsEntity])],
  providers: [CardsService],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
