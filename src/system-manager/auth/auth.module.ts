import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '../application/application.module';
import { LayerModule } from '../layer/layer.module';
import { LoggerModule } from '../logger/logger.module';
import { systemManagerOption } from '../system-manager.token';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    LoggerModule,
    LayerModule,
    ApplicationModule,
    JwtModule.registerAsync({
      useFactory: () => systemManagerOption.jwt,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PassportModule,
    UserModule,
    JwtModule,
  ],
})
export class AuthModule {}
