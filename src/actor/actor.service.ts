/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorEntity } from './entities/actor.entity';
import { CreateActorDto } from './dto/actor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Actor } from 'generated/prisma/client';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(ActorEntity)
    private readonly actorRepository: Repository<ActorEntity>,

    private readonly prismaService: PrismaService,
  ) {}

  async createPrisma(dto: CreateActorDto): Promise<Actor> {
    const { name } = dto;
    const actor = await this.prismaService.actor.create({ data: { name } });
    return actor;
  }

  async create(dto: CreateActorDto): Promise<ActorEntity> {
    const { name } = dto;
    const actor = this.actorRepository.create({ name });
    return await this.actorRepository.save(actor);
  }

  async findById(id: string): Promise<ActorEntity | null> {
    const movie = await this.actorRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!movie) {
      throw new NotFoundException(`Actor with id ${id} not found`);
    }
    return movie;
  }
}
