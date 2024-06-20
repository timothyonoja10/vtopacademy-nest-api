import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsEmail()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}