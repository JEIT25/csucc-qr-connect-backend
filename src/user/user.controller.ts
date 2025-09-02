import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { hasSubscribers } from 'diagnostics_channel';

@Controller('admins/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('store')
  async createUser(@Body() body: CreateUserDto) {
    const { password_confirm, password, ...data } = body;

    if (password != password_confirm) {
      //check if password confirm match
      return new BadRequestException('Password and Password Confirmation do not match.'); //throws 400 bad request status code for client sending invalid data
    }

    const hashedPw = await bcrypt.hash(password, 12); //has password

    //save new user with hashed password
    return this.userService.save({
      ...data,
      password: hashedPw,
    });
  }
}
