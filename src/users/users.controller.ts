import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { ParseResourceAssignmentDto } from './dto/parse-resource-assignment.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created properly.',
      user,
    };
  }

  @Post('parse-resource-assignment')
  async parseResourceAssignment(@Body() parseResourceAssignmentDto: ParseResourceAssignmentDto) {
    return this.usersService.parseResourceAssignment(parseResourceAssignmentDto.command);
  }

  @Get()
  findAll(@Query() query: FindUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    return this.usersService.findOne(numericId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    const user = await this.usersService.update(numericId, updateUserDto);
    return {
      message: 'User modified properly.',
      user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    await this.usersService.remove(numericId);
    return {
      message: 'User deleted properly.',
    };
  }
}
