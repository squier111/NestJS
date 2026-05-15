import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { MovieService } from 'src/movie/movie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Review } from 'generated/prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly movieService: MovieService,
    private readonly prismaService: PrismaService,
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

  async createPrisma(dto: CreateReviewDto): Promise<Review> {
    const { text, rating, movieId } = dto;

    const review = await this.prismaService.review.create({
      data: {
        text: text!,
        rating: rating!,
        movie: { connect: { id: movieId! } },
      },
    });

    return review;
  }
}
