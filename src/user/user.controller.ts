import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('admin'))
@Controller('admins/users')
export class UserController {
  constructor(private userService: UserService) {}

  //get all users, for now restricted to instructors
  @Get()
  async getUsers() {
    return this.userService.find({ where: { role: 'instructor' } });
  }

  //create new user, instructor and admin
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const { password_confirm, password, email, ...data } = body;

    // 1️ Check password confirmation
    if (password !== password_confirm) {
      throw new BadRequestException('Password and Password Confirmation do not match.');
    }

    // 2️ Check if email already exists
    const existingUser = await this.userService.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    // 3️Hash password
    const hashedPw = await bcrypt.hash(password, 12);

    // 4️Save new user
    const user = await this.userService.save({
      ...data,
      email,
      password: hashedPw,
    });

    return {
      success: 'User successfully created!',
      user,
    };
  }

  //delete user type instructor only
  @Delete(':user_id')
  async deleteUser(@Param('user_id') user_id: number) {
    try {
      const currDeletedusr = await this.userService.findOneBy({
        user_id: user_id,
        role: UserRole.INSTRUCTOR, //prevents admin accounts from being delete
      });
      if (!currDeletedusr || currDeletedusr.role == 'admin') {
        throw new BadRequestException(`User with user_ID ${user_id} not found`);
      }

      await this.userService.delete(user_id);
      return {
        success: `User has been success fully delete!`,
        deleted_acc_info: currDeletedusr,
      };
    } catch (err) {
      throw new BadRequestException('The selected instructor account is not found.');
    }
  }

  //get current user to edit information from db
  @Get(':user_id/edit')
  async getUserToEdit(@Param('user_id') user_id: number) {
    // Find the existing user
    const existingUser = await this.userService.findOneBy({ user_id });

    //if user not found and is an admin
    if (!existingUser || existingUser.role == 'admin') {
      throw new NotFoundException({ error: 'The user was not found.' });
    }

    // Return success response
    return existingUser;
  }

  //edit user type instructor including password
  @Patch(':user_id/edit')
  async editUser(@Param('user_id') user_id: number, @Body() body: UpdateUserDto) {
    // Find the existing user
    const existingUser = await this.userService.findOneBy({ user_id });

    //if user not found and is an admin
    if (!existingUser || existingUser.role == 'admin') {
      throw new NotFoundException({ error: 'The user was not found.' });
    }

    //  Filter out null, undefined, or empty string values
    const filteredData = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    // Handle password change
    if (filteredData.password || filteredData.password_confirm) {
      if (filteredData.password !== filteredData.password_confirm) {
        throw new BadRequestException('Password and Password Confirmation do not match.');
      }

      // Hash the new password
      filteredData.password = await bcrypt.hash(filteredData.password, 12);

      // Remove password_confirm before saving
      delete filteredData.password_confirm;
    }

    //  Perform the update
    await this.userService.update(user_id, filteredData);

    //Fetch the updated record
    const updatedUser = await this.userService.findOneBy({ user_id });

    // Return success response
    return {
      success: 'User successfully updated.',
      updated_acc: updatedUser,
    };
  }
}
