import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entity/review.entity';
import { MovieService } from 'src/movie/movie.service';
import { MovieEntity } from 'src/movie/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, MovieEntity])],
  controllers: [ReviewController],
  providers: [ReviewService, MovieService],
})
export class ReviewModule {}
