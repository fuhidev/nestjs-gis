import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '../application/application.module';
import { LayerModule } from '../layer/layer.module';
import { LoggerModule } from '../logger/logger.module';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './auth.constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '7 days' },
        }), PassportModule, UserModule,
        LoggerModule,
        LayerModule,
        ApplicationModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService, LocalStrategy, JwtStrategy, JwtModule, PassportModule, UserModule]
})
export class AuthModule { }
