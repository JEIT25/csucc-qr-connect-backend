import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  // @Post('login')
  // async login(@Body() body: Body) {
  //   return this.AuthService.login(body);
  //  }
}
