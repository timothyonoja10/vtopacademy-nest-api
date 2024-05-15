import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRoleDto.name;

    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Role | undefined> {
    return await this.roleRepository.findOneBy({ name });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error('Role not found')
    }
    role.name = updateRoleDto.name;

    return await this.roleRepository.save(role)
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
