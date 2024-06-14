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
    private authService: AuthService, 
    private readonly mailService: MailerService
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseDto> {
    await this.authService.register(
      registerDto.username, registerDto.password, registerDto.confirmPassword
    );
    let signInDto = new SignInDto(registerDto.username, registerDto.password);
    return await this.signIn(signInDto);
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
    try {
      const username = forgotPasswordDto.username;
      const isNotRegisteredUser = await this.authService.isNotRegisteredUser(username);
      if (isNotRegisteredUser) {
        throw new UnauthorizedException('Not a registered user');
      }
      const forgotPasswordCode = '123456'; // This should be dynamically generated in a real application
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
      this.mailService.sendMail(email);
      await this.authService.saveForgotPasswordCode(username, forgotPasswordCode);
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Unable to send email ${error}`);
    }  
  }

  @Public()
  @HttpCode(HttpStatus.OK) 
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<ResponseDto> {
    const username = changePasswordDto.username;
    const newPassword = changePasswordDto.newPassword;
    const code = changePasswordDto.code;
    const isNotRegisteredUser = await this.authService.isNotRegisteredUser(username);
    if (isNotRegisteredUser) {
      throw new UnauthorizedException('Not a registered user');
    }
    const verified = this.authService.verifyForgotPasswordCode(username, code);
    if (!verified) {
      throw new UnauthorizedException('Invalid forgot password code');;
    }
    const updated = await this.authService.updateUser(username, newPassword);
    let signInDto = new SignInDto(username, newPassword);
    return await this.signIn(signInDto);
  }
}