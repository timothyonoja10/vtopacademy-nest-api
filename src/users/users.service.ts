
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordCode } from './entities/ForgotPasswordCode';
import { Role } from './entities/role.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ForgotPasswordCode)
    private forgotPasswordCodeReposotory: Repository<ForgotPasswordCode>,
  ) {} 

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await bcrypt.hash(createUserDto.password, 10); // Hash the password
    user.roles = createUserDto.roles;
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ username });
  }

  async update(
    id: number, username: string, 
    password: string, roles: Role[]
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    user.username = username;
    user.password = await bcrypt.hash(password, 10); // Hash the password
    user.roles = roles;
    
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async saveForgotPassswordCode(username: string, code: string): Promise<boolean> {
    const dbEntry = await this.forgotPasswordCodeReposotory.findOneBy({ username });
    if (dbEntry) {
      await this.forgotPasswordCodeReposotory.delete(dbEntry.id);
    }
    const newEntry = new ForgotPasswordCode();
    newEntry.username = username;
    newEntry.code = code;
    await this.forgotPasswordCodeReposotory.save(newEntry);
    return true;
  }
  
  async verifyForgotPasswordCode(username: string, code: string): Promise<boolean> {
    const dbEntry = await this.forgotPasswordCodeReposotory.findOneBy({ username });
    if (!dbEntry || dbEntry.code !== code) {
      return false;
    }
    await this.forgotPasswordCodeReposotory.delete(dbEntry.id);
    return true;
  }
}