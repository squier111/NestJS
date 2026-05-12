import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  @Length(3, 40, { message: 'Title must be between 3 and 40 characters' })
  title!: string;

  @IsBoolean({ message: 'isCompleted must be a boolean' })
  isCompleted!: boolean;
}
