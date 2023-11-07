import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/user.dto';
import { UserService } from 'src/users/user.service';
import { UserDocument } from 'src/schemas/user.schema';
require('dotenv').config();

export type JwtPayload = {
    sub: string;
  };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<UserDocument> {
        const user = await this.userService.findOneByStudentId(payload.sub);
        if (!user) throw new UnauthorizedException('Please log in to continue');
        return user;
    }
}
