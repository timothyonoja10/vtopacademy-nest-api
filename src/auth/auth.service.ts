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

  async register(username: string, password: string, confirm_password: string): Promise<boolean> {
    if (password != confirm_password) {
      throw new UnauthorizedException('Passwords do not match');
    }
    let user = await this.usersService.findOneByUsername(username);
    if (user) {
      throw new ConflictException('Account already exists');
    }

    const roles = username === "tolu@gmail.com" ? [Role.Admin, Role.User] : [Role.User];
    await this.usersService.create({ username, password, roles });

    return true;
  }

  async signIn(username: string, password: string): Promise<ResponseDto> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const isAdmin = user.roles.includes(Role.Admin);
    const isUser = user.roles.includes(Role.User);

    const response = new ResponseDto(accessToken, isAdmin, isUser);
    return response;
  }

  async isNotRegisteredUser(username: string): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return true;
    }
    return false;
  }

  async updateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(username);
    const result = await this.usersService.update(user.id, username, password, user.roles);
    return true;
  }

  async verifyForgotPasswordCode(username: string, code: string): Promise<boolean> {
    return await this.usersService.verifyForgotPasswordCode(username, code);
  }

  async saveForgotPasswordCode(username: string, code: string): Promise<boolean> {
    return await this.usersService.saveForgotPassswordCode(username, code);
  }
}