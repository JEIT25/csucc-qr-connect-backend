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

  @Patch('users/edit')
  async update(@Body() body: UpdateUserDto, @Req() request: Request) {
    const { user_id } = await this.authService.decryptJwt(request.cookies.jwt);

    //filter usig Object.entries = turns the key/value pair into an array per pair(nested)
    //the "_" is the key , which is ignored
    //only return values that are not null,not undefined and not empty strings ''
    //wrapped in a Object.fromEntries so that the returned array from Object.entries is returned back into an object
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(
        ([_, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    await this.userService.update(user_id, filteredBody);
    return {
      success: 'User successfully updated',
    };
  }
}
