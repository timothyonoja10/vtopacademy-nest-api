import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Roles } from 'src/roles/decorators/roles.decorator';

@Controller({
  path: 'api/roles',
  version: VERSION_NEUTRAL, 
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('Admin')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles('Admin')
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('Admin')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('Admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.remove(id);
  }
}