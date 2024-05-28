import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/users/entities/role.entity';

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
      throw new UnauthorizedException('Account already exists');
    }

    const roles = username === "timothy@gmail.com" ? [Role.Admin, Role.User] : [Role.User];
    await this.usersService.create({ username, password, roles });

    return true;
  }

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}