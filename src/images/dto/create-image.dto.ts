import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}