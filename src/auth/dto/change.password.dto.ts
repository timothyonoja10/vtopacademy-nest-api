
export class ChangePasswordDto {
  readonly username: string;
  readonly code: string;
  readonly newPassword: string;
}