import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { CardsModule } from 'src/cards/cards.module';
import { UserModule } from 'src/user/user.module';
import { ColumnsModule } from 'src/columns/columns.module';

@Module({
  imports: [
    CardsModule,
    UserModule,
    ColumnsModule,
    TypeOrmModule.forFeature([CommentsEntity]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
