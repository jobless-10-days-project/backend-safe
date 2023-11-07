import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto} from 'src/users/user.dto';
import { SignInDto, SignUpDto } from './auth.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

   @Post('signup')
    signUp(@Body() dto: CreateUserDto) {
      return this.authService.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() dto: CreateUserDto) {
      return this.authService.signIn(dto)
    }

/*
    @Get('signintoong')
    signInToong(@Body() dto: SignInDto) {
      return this.authService.paotoongSignIn(dto)
    }

    @Post('signuptoong')
    signUpToong(@Body() dto: SignUpDto) {
      return this.authService.paotoongSignUp(dto)
    }
*/
}
