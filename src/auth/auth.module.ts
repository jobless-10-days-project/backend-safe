import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule, HttpService } from "@nestjs/axios";
require('dotenv').config();

@Module({
    controllers: [AuthController],
    providers: [AuthService , JwtStrategy],
    imports: [
        UserModule,
        PassportModule,
        HttpModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions:{expiresIn: process.env.JWT_TIME}
        }),
    ],
    
})
export class AuthModule {}

