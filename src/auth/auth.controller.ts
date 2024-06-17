import { Body, Controller, Post, HttpCode, HttpStatus, VERSION_NEUTRAL, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { ResponseDto } from './dto/response.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { Email } from 'src/app.entities';
import { ChangePasswordDto } from './dto/change.password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller({
  path: 'api/auth',
  version: VERSION_NEUTRAL,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailerService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseDto> {
    await this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.confirmPassword,
    );
    return await this.signIn({ username: registerDto.username, password: registerDto.password });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ResponseDto> {
    return await this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    const username = forgotPasswordDto.username;
    const isNotRegisteredUser = await this.authService.isNotRegisteredUser(username);

    if (isNotRegisteredUser) {
      throw new UnauthorizedException('Not a registered user');
    }

    const forgotPasswordCode = this.generateForgotPasswordCode();
    const email = new Email(
      'Vtopacademy <vtopacademy@gmail.com>',
      username,
      'Reset Your Password',
      `Dear User,

      We received a request to reset your password. Use the code below to reset your password:

      Forgot Password Code: ${forgotPasswordCode}

      If you didn't request a password reset, please ignore this email or contact support if you have any questions.

      Best regards,
      Vtopacademy Support Team`
    );

    await this.mailService.sendMail(email);
    await this.authService.saveForgotPasswordCode(username, forgotPasswordCode);

    return true;
  }

  private generateForgotPasswordCode(): string {
    const min = 100000;
    const max = 999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<ResponseDto> {
    const { username, newPassword, code } = changePasswordDto;
    const isNotRegisteredUser = await this.authService.isNotRegisteredUser(username);

    if (isNotRegisteredUser) {
      throw new UnauthorizedException('Not a registered user');
    }

    const verified = await this.authService.verifyForgotPasswordCode(username, code);
    if (!verified) {
      throw new UnauthorizedException('Invalid forgot password code');
    }

    await this.authService.updateUser(username, newPassword);

    return await this.signIn({ username, password: newPassword });
  }
}