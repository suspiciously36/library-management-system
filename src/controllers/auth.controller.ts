import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @ResponseMessage()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh() {
    return await this.authService.refresh();
  }
}
