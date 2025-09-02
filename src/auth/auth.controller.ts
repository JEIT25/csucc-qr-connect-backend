import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.userService.findOneBy({ email: body.email });

    if (!user) {
      throw new NotFoundException('Account was not found.');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Account credentials did not match our records.');
    }

    const jwt = await this.authService.createJwt(user); //signs, creates, and returns the jwt based on the id of the user
    response.cookie('jwt', jwt, { httpOnly: true }); //stores the cookie to the client , httpOnly option not accessible to client side
    return { success: 'Login success' };
  }
}
