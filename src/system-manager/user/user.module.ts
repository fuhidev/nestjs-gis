import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserStatusEntity } from './user-status/user-status.entity';
import { UserStatusService } from './user-status/user-status.service';
import { systemManagerOption } from '../system-manager.token';
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserEntity, UserStatusEntity],
    ),
  ],
  controllers: [UserController],
  providers: [UserService, UserStatusService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
