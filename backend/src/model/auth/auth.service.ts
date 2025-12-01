
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { comparePassword } from 'src/common/helpers/crypto';
import AuthLoginInput from './dto/login.input';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) { }

  async jwtToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.refreshTokenService.generate(user.id),
    };
  }

  async login({ email, password }: AuthLoginInput): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (!comparePassword(password, user.password!))
      throw new UnauthorizedException('Credenciais incorretas');

    return this.jwtToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      password: '',
      created_at: user.created_at,
    });
  }
}
