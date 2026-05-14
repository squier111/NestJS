import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  create(@Body() dto: CreateActorDto) {
    return this.actorService.create(dto);
  }

  @Post('prisma')
  createPrisma(@Body() dto: CreateActorDto) {
    return this.actorService.createPrisma(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.actorService.findById(id);
  }
}
