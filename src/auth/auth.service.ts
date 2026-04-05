import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/modules-system/prisma/token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService
  ) { }

  async login(body: LoginDto) {
    const email = body.email;
    const password = body.password;

    const userExits = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });
    if (!userExits) {
      throw new BadRequestException('User not found');
    }
    const storedPassword = String(userExits.password);
    const isBcryptValid = /^\$2[aby]\$\d{2}\$/.test(storedPassword);
    const isPassword = isBcryptValid ? bcrypt.compareSync(password, storedPassword) : password === storedPassword;
    if (!isPassword) {
      throw new BadRequestException('Mật khẩu khống chính xác');
    }
    if (!isBcryptValid) {
      const passwordHash = bcrypt.hashSync(password, 10);
      await this.prisma.user.update({
        where: {
          id: userExits.id,
        },
        data: {
          password: passwordHash,
        }
      });
    }
    const accessToken = this.tokenService.createAccessToken(userExits.id);
    const refreshToken = this.tokenService.createRefreshToken(userExits.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // kiểm tra email có tồn tại trong db hay không
    const userExits = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // nếu người dùng tồn tại thì từ chối
    if (userExits) {
      throw new BadRequestException("Người dùng đã tồn tại, vui lòng đăng nhập");
    }

    // HASH: băm => bcrypt
    // không thể dịch ngược
    // so sánh

    // ENCRYPTION: mã hoá
    // dịch ngược

    const passwordHash = bcrypt.hashSync(password, 10);

    // tạo mới người dùng vào db
    await this.prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
        name: name,
      },
    });

    console.log({ email, password, name, userExits });

    return true;
  }

}
