import { Controller, Get, Post, Body, Patch,
  Param, Delete, ParseIntPipe, VERSION_NEUTRAL } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Roles } from 'src/roles/decorators/roles.decorator';

@Controller({
 path: 'api/users',
 version: VERSION_NEUTRAL, 
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('Admin')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('Admin')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Roles('Admin')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}