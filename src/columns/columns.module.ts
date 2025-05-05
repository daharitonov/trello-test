import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './columns.entity';
import { ColumnsController } from './columns.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ColumnEntity])],
  exports: [ColumnsService],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnsModule {}
