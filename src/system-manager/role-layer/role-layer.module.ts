import { Module } from '@nestjs/common';
import { RoleLayerController } from './role-layer.controller';
import { RoleLayerService } from './role-layer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleLayerEntity } from './role-layer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleLayerEntity])],
  controllers: [RoleLayerController],
  providers: [RoleLayerService],
  exports: [TypeOrmModule, RoleLayerService]
})
export class RoleLayerModule { }
