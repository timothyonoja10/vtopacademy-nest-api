import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/decorators/roles.decorator';

@Injectable()
@Roles('Admin')
export class AuthService {

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
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

    let roles = [];

    let roleUser = await this.rolesService.findOneByName("User");
    if (!roleUser) {
      roleUser = await this.rolesService.create({name: "User"});
      roles.push(roleUser);
    }

    let roleAdmin = await this.rolesService.findOneByName("Admin");
    if (!roleAdmin && username === "timothyonoja@gmail.com") {
      roleAdmin = await this.rolesService.create({name: "Admin"});
      roles.push(roleAdmin);
    }

    user = await this.usersService.create({
      username: username,
      password: password,
      roles: roles
    });

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