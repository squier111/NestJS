import { IsArray, IsEnum,  IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, IsUUID, Length, Matches, Min, MinLength } from "class-validator";
import { StartsWith } from "../decorators/starts-with.decorator";

export enum TaskWork {
    WORK = 'work',
    STUDY = 'study',
    HOME = 'home'
}

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @StartsWith('Task', {message: 'Title must start with "Task"'})
    @Length(3)
    title!: string;

    @IsString({message: 'Description must be a string'})
    @IsOptional()
    description?: string;

    @IsInt({message: 'Priority must be an integer'})
    @IsOptional()
    @IsPositive({message: 'Priority must be a positive number'})
    priority?: number

    @IsArray({message: 'Tags must be an array'})
    @IsOptional()
    @IsEnum(TaskWork, {each: true, message: 'Each tag must be one of the following values: work, study, home'})
    tags? : string[];

    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one number'})
    password?: string;

    @IsUrl({
        protocols: ['https', 'wss'],
        host_blacklist: ['htmllessons.io']},
        {message: 'Website URL must be a valid URL'})
    @IsOptional()
    websiteUrl?: string;

    @IsUUID('4', {message: 'User ID must be a valid UUID v4'})
    userID?: string
}