import { Controller, Get, Post, Body, Patch, Param, Delete, VERSION_NEUTRAL } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Roles } from 'src/users/decorators/roles.decorator';
import { School } from './entities/school.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/users/entities/role.entity';

@Controller({
  path: 'api/schools',
  version: VERSION_NEUTRAL, 
 })
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}
  
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return await this.schoolsService.create(createSchoolDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<School[]> {
    return await this.schoolsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<School> {
    return await this.schoolsService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return await this.schoolsService.update(+id, updateSchoolDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.schoolsService.remove(+id);
  }
}
