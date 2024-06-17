import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    private forgotPasswordCodeRepository: Repository<ForgotPasswordCode>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User();
      user.username = createUserDto.username;
      user.password = await bcrypt.hash(createUserDto.password, 10); // Hash the password
      user.roles = createUserDto.roles;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error finding users');
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOneBy({ username });
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by username');
    }
  }

  async update(id: number, username: string, password: string, roles: Role[]): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.username = username;
      user.password = await bcrypt.hash(password, 10); // Hash the password
      user.roles = roles;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async saveForgotPasswordCode(username: string, code: string): Promise<boolean> {
    try {
      const dbEntry = await this.forgotPasswordCodeRepository.findOneBy({ username });
      if (dbEntry) {
        await this.forgotPasswordCodeRepository.delete(dbEntry.id);
      }
      const newEntry = new ForgotPasswordCode();
      newEntry.username = username;
      newEntry.code = code;
      await this.forgotPasswordCodeRepository.save(newEntry);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Error saving forgot password code');
    }
  }

  async verifyForgotPasswordCode(username: string, code: string): Promise<boolean> {
    try {
      const dbEntry = await this.forgotPasswordCodeRepository.findOneBy({ username });
      if (!dbEntry || dbEntry.code !== code) {
        return false;
      }
      await this.forgotPasswordCodeRepository.delete(dbEntry.id);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Error verifying forgot password code');
    }
  }
}
