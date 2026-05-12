import { ActorEntity } from 'src/actor/entities/actor.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MoviePosterEntity } from './poster.entity';

export enum Genre {
  Action = 'Action',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Horror = 'Horror',
}

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description: string | undefined;

  @Column({ name: 'release_year', type: 'int', unsigned: true, nullable: true })
  releaseYear: number | undefined;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0.0,
  })
  rating: number | undefined;

  @Column({ name: 'is_available', type: 'boolean', default: false })
  isAvaliable: boolean | undefined;
  @Column({ type: 'date', nullable: true })
  releaseDate: Date | undefined;

  @Column({
    type: 'enum',
    enum: Genre,
    default: Genre.Action,
  })
  genre!: Genre;

  @Column({ name: 'poster_id', type: 'uuid', nullable: true })
  posterId: string | undefined;

  @OneToMany(() => ReviewEntity, (review) => review.movie)
  reviews: ReviewEntity[] | undefined;

  @ManyToMany(() => ActorEntity, (actor) => actor.movies)
  @JoinTable({
    name: 'movie_actors',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' },
  })
  actors: ActorEntity[] | undefined;

  @OneToOne(() => MoviePosterEntity, (poster) => poster.movie, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'poster_id' })
  poster: MoviePosterEntity | null | undefined;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | undefined;
}
