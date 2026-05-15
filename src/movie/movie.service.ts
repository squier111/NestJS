import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { In, Repository } from 'typeorm';
import { MovieDto } from './dto/movie.dto';
import { ActorEntity } from 'src/actor/entities/actor.entity';
import { MoviePosterEntity } from './entities/poster.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie, Prisma } from 'generated/prisma/client';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,

    @InjectRepository(MoviePosterEntity)
    private readonly moviePosterRepository: Repository<MoviePosterEntity>,

    @InjectRepository(ActorEntity)
    private readonly actorRepository: Repository<ActorEntity>,

    private readonly prismaService: PrismaService,
  ) {}
  // constructor(private readonly userService: UserService) {}

  // test() {
  //   return this.userService.test();
  // }

  async findAllPrisma(): Promise<
    Prisma.MovieGetPayload<{
      select: {
        id: true;
        title: true;
        actors: { select: { name: true; id: true } };
      };
    }>[]
  > {
    return await this.prismaService.movie.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        isAvailable: true,
        actors: { select: { name: true, id: true } },
      },
      take: 10,
      skip: 0,
      // select: ['id'],
    });
  }

  async findByIdPrisma(id: string): Promise<Movie | null> {
    const movie = await this.prismaService.movie.findUnique({
      where: { id },
      include: { actors: true, poster: true, reviews: true },
    });

    if (!movie || movie.isAvailable === false) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async createPrisma(dto: MovieDto): Promise<Movie> {
    const { title, releaseYear, imageUrl, isAvailable, actorIds } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actors = await this.prismaService.actor.findMany({
      where: { id: { in: actorIds || [] } },
    });

    if (!actors || actors.length === 0) {
      throw new NotFoundException(`One or more actors not found`);
    }

    const movie = await this.prismaService.movie.create({
      data: {
        title,
        releaseYear,
        isAvailable: isAvailable ?? false,
        poster: imageUrl ? { create: { url: imageUrl } } : undefined,
        actors: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          connect: actors.map((actor) => ({ id: actor.id })),
        },
      },
      include: { poster: true, actors: true },
    });
    return movie;
  }

  async updatePrisma(id: string, dto: MovieDto): Promise<boolean> {
    const movie = await this.findByIdPrisma(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actors = await this.prismaService.actor.findMany({
      where: { id: { in: dto.actorIds || [] } },
    });

    await this.prismaService.movie.update({
      where: { id: movie?.id },
      data: {
        title: dto.title,
        releaseYear: dto.releaseYear,
        poster: dto.imageUrl ? { create: { url: dto.imageUrl } } : undefined,
        actors: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          connect: actors.map((actor) => ({ id: actor.id })),
        },
      },
    });

    return true;
  }

  async deletePrisma(id: string): Promise<string> {
    const movie = await this.findByIdPrisma(id);

    await this.prismaService.movie.delete({ where: { id } });

    return movie?.id as string;
  }

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
