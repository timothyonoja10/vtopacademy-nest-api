import { Role } from "../entities/role.entity";

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly roles: Role[];
}