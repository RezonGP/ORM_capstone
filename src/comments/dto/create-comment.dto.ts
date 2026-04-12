import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'imageId bị rỗng' })
  @IsInt({ message: 'imageId phải là số nguyên' })
  imageId: number;

  @IsNotEmpty({ message: 'content bị rỗng' })
  @IsString({ message: 'content phải là chuỗi ký tự' })
  content: string;
}
