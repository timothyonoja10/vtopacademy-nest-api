import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @IsEmail()
  readonly username: string;
}