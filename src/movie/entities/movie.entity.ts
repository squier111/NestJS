import { ReviewEntity } from 'src/review/entity/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(() => ReviewEntity, (review) => review.movie)
  reviews: ReviewEntity[] | undefined;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | undefined;
}
