import { MovieEntity } from 'src/movie/entities/movie.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Genre {
  Action = 'Action',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Horror = 'Horror',
}

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string | undefined;

  @Column({ type: 'text' })
  text: string | undefined;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0.0,
  })
  rating: number | undefined;

  @Column({ name: 'movie_id', type: 'uuid' })
  movieId: string | undefined;

  @ManyToOne(() => MovieEntity, (movie) => movie.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity | undefined;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | undefined;
}
