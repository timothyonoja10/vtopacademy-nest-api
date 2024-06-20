import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @IsEmail()
  readonly username: string;
  @IsNotEmpty()
  readonly code: string;
  @IsNotEmpty()
  readonly newPassword: string;
}