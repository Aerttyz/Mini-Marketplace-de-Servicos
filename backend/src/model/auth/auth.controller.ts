import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthLoginInput from './dto/login.input';
import AuthRefreshTokenInput from './dto/refresh-token';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshToken: RefreshTokenService,
  ) { }

  @Post('login')
  async login(@Body() data: AuthLoginInput): Promise<string | null> {
    return await this.authService.login(data);
  }

  @Post('refresh-token')
  async refreshTokenRouter(
    @Body() data: AuthRefreshTokenInput,
  ): Promise<{ access_token: string | null }> {
    const access_token = await this.refreshToken.refresh(data.refresh_token);
    return { access_token };
  }
}
