import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Headers,
  Req,
  Res,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import type { Request, Response } from 'express';
import { MovieDto } from './dto/movie.dto';

@Controller({
  path: 'movies',
  // host: ['api.test.com'],
})
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Post()
  create(@Body() dto: MovieDto) {
    return this.movieService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: MovieDto) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.movieService.delete(id);
  }

  @Get()
  findAlls(@Query() query: any) {
    return `${JSON.stringify(query)}`;
    // return genre ? `films in genre ${genre}` : [
    //   { id: 1, title: 'The Shawshank Redemption', year: 1994 },
    //   { id: 2, title: 'The Godfather', year: 1972 },
    //   { id: 3, title: 'The Dark Knight', year: 2008 },
    // ];
  }

  @Get(':id')
  findByIds(@Param('id') id: string) {
    return { id };
  }

  @Post()
  createAll(@Body() body: { title: string; year: number }) {
    return `This film has been created with title: ${body.title} ${body.year ? ` and year: ${body.year}` : ''}`;
  }

  @Get('headers')
  getHeaders(@Headers() headers: Record<string, unknown>) {
    return headers;
  }

  @Get('user-agent')
  getUserAgent(@Headers('user-agent') userAgent: string) {
    return { userAgent };
  }

  @Get('request')
  getRequest(@Req() req: Request) {
    return {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      params: req.params,
    };
  }

  @Get('responce')
  getResponse(@Res() res: Response) {
    return res.status(200).json({ message: 'This is a custom response' });
  }

  // @Get('test')
  // test() {
  //   return this.movieService.test();
  // }
}
