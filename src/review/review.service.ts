import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly movieService: MovieService,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewEntity> {
    const { text, rating, movieId } = dto;
    const movie = await this.movieService.findById(dto.movieId!);

    if (!movie) {
      throw new Error(`Movie with id ${dto.movieId} not found`);
    }

    const review = this.reviewRepository.create({ text, rating, movieId });

    return await this.reviewRepository.save(review);
  }
}
