import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { In, Repository } from 'typeorm';
import { MovieDto } from './dto/movie.dto';
import { ActorEntity } from 'src/actor/entities/actor.entity';
import { MoviePosterEntity } from './entities/poster.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,

    @InjectRepository(MoviePosterEntity)
    private readonly moviePosterRepository: Repository<MoviePosterEntity>,

    @InjectRepository(ActorEntity)
    private readonly actorRepository: Repository<ActorEntity>,
  ) {}
  // constructor(private readonly userService: UserService) {}

  // test() {
  //   return this.userService.test();
  // }

  async findAll(): Promise<MovieEntity[]> {
    return await this.movieRepository.find({
      where: { isAvaliable: false },
      relations: ['poster', 'actors'],
      order: { createdAt: 'DESC' },
      take: 10,
      // select: ['id'],
    });
  }

  async findById(id: string): Promise<MovieEntity | null> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['actors'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async create(dto: MovieDto): Promise<MovieEntity> {
    const { title, releaseYear, imageUrl, actorIds } = dto;

    const actors = await this.actorRepository.find({
      where: { id: In(actorIds || []) },
    });

    if (!actors || actors.length === 0) {
      throw new NotFoundException(`One or more actors not found`);
    }

    let poster: MoviePosterEntity | null = null;

    if (imageUrl) {
      poster = this.moviePosterRepository.create({ url: imageUrl });
      await this.moviePosterRepository.save(poster);
    }

    const movie = this.movieRepository.create({
      title,
      releaseYear,
      actors,
      poster,
    });
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
