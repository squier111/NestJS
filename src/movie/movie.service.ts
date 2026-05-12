import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}
  // constructor(private readonly userService: UserService) {}

  // test() {
  //   return this.userService.test();
  // }

  async findAll(): Promise<MovieEntity[]> {
    return await this.movieRepository.find({
      where: { isAvaliable: false },
      order: { createdAt: 'DESC' },
      take: 10,
      // select: ['id'],
    });
  }

  async findById(id: string): Promise<MovieEntity | null> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async create(dto: MovieDto): Promise<MovieEntity> {
    const movie = this.movieRepository.create(dto);
    return await this.movieRepository.save(movie);
  }

  async update(id: string, dto: MovieDto): Promise<boolean> {
    const movie = await this.findById(id);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    Object.assign(movie, dto);

    await this.movieRepository.save(movie);

    return true;
  }

  async delete(id: string): Promise<string> {
    const movie = await this.findById(id);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    await this.movieRepository.remove(movie);

    return movie.id as string;
  }
}
