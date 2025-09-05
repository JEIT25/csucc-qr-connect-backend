import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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

    const jwt = await this.authService.createJwt(user); //signs, creates, and returns the jwt based on the id and role of the user
    response.cookie('jwt', jwt, { httpOnly: true }); //stores the cookie to the client , httpOnly option not accessible to client side
    return { success: 'Login success' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      success: 'Logout successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Get('users/profile')
  async getCurrentUser(@Req() request: Request) {
    const { user_id, role } = await this.authService.decryptJwt(request.cookies.jwt); //returns id and role
    const currentUser = this.userService.findOneBy({ user_id: user_id, role: role });
    return currentUser;
  }

  //change password for instructors
  @UseGuards(AuthGuard)
  @Patch('users/edit/password')
  async editPassword(
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
    @Req() request: Request,
  ) {
    const { user_id } = await this.authService.decryptJwt(request.cookies.jwt);

    if (password !== password_confirm) {
      throw new BadRequestException('Password and Password Confirmation do not match');
    }

    const hashedPw = bcrypt.hash(password, 12);

    await this.userService.update(user_id, { password: hashedPw });

    return {
      success: 'User successfully updated password',
    };
  }

  //change account details for admins only
  @UseGuards(AuthGuard)
  @Patch('users/edit')
  async update(@Body() body: UpdateUserDto, @Req() request: Request) {
    try {
      const { user_id } = await this.authService.decryptJwt(request.cookies.jwt);

      await this.userService.update(user_id, body);
      return {
        success: 'User successfully updated',
      };
    } catch (err) {
      return {
        error: err.detail,
      };
    }
  }
}
