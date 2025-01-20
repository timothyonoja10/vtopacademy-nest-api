import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';

@Injectable()
export class SchoolsService {

  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new School()
    school.name = createSchoolDto.name;
    school.number = createSchoolDto.number;
    
    return await this.schoolsRepository.save(school);
  }

  async findAll(): Promise<School[]> {
    return await this.schoolsRepository.find();
  }

  async findOne(schoolId: number): Promise<School | null> {
    return await this.schoolsRepository.findOneBy({ schoolId });
  }

  async update(schoolId: number, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.schoolsRepository.findOneBy({ schoolId });
    if (!school) {
      throw new Error('School not found');
    }
    school.name = updateSchoolDto.name;
    school.number = updateSchoolDto.number;

    return await this.schoolsRepository.save(school);
  }

  async remove(schoolId: number) {
    await this.schoolsRepository.delete(schoolId);
  }
}
