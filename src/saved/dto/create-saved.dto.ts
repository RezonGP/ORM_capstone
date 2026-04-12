import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSavedDto {
  @IsNotEmpty({ message: 'imageId bị rỗng' })
  @IsInt({ message: 'imageId phải là số nguyên' })
  imageId: number;
}
