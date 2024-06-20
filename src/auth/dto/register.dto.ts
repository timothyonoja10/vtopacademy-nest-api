import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsEmail()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly confirmPassword: string;
}