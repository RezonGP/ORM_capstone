import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email bị rỗng' })
  @IsEmail(undefined, { message: 'Email bị sai định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Name bị rỗng' })
  @IsString({ message: 'Name phải là chuỗi ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Password bị rỗng' })
  @IsString({ message: 'Password phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Password phải nhất 6 ký tự' })
  password: string;
}
