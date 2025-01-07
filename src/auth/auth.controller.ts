import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() response: Response,
  ) {
    return this.authService.login(body.email, body.password, response);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Headers('authorization') authorizationHeader: string,
    @Res() response: Response,
  ) {
    const accessToken = authorizationHeader.split(' ')[1];
    return this.authService.logout(accessToken, response);
  }

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() request: Request) {
    const refreshToken = request.cookies['refreshToken'];
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Headers('authorization') authorizationHeader: string) {
    const accessToken = authorizationHeader.split(' ')[1];
    return this.authService.getMe(accessToken);
  }
}
