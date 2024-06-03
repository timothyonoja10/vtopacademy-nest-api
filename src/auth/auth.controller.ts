import { Body, Controller, Post, HttpCode, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { ResponseDto } from './dto/response.dto';

@Controller({
  path: 'api/auth',
  version: VERSION_NEUTRAL, 
})
export class AuthController {
  constructor(private authService: AuthService) {}

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
  signIn(@Body() signInDto: SignInDto): Promise<ResponseDto> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  } 

}