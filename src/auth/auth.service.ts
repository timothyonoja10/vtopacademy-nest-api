import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/users/entities/role.entity';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, confirmPassword: string): Promise<boolean> {
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const existingUser = await this.usersService.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('Account already exists');
    }

    const roles: Role[] = username === 'tolu@gmail.com' ? [Role.Admin, Role.User] : [Role.User];
    await this.usersService.create({ username, password, roles });

    return true;
  }

  async signIn(username: string, password: string): Promise<ResponseDto> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);

    return new ResponseDto(
      accessToken,
      user.roles.includes(Role.Admin),
      user.roles.includes(Role.User),
    );
  }

  async isNotRegisteredUser(username: string): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(username);
    return !user;
  }

  async updateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(username);
    await this.usersService.update(user.id, username, password, user.roles);
    return true;
  }

  async verifyForgotPasswordCode(username: string, code: string): Promise<boolean> {
    return await this.usersService.verifyForgotPasswordCode(username, code);
  }

  async saveForgotPasswordCode(username: string, code: string): Promise<boolean> {
    return await this.usersService.saveForgotPasswordCode(username, code);
  }
}