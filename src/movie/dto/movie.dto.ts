import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class MovieDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsInt()
	@Min(1888, { message: 'Release year must be greater than or equal to 1888' })
	@Max(new Date().getFullYear())
  releaseYear?: number;
}