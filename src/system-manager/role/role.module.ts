import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { RoleLayerEntity } from '../role-layer/role-layer.entity';
import { LayerEntity } from '../layer/layer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, RoleLayerEntity,LayerEntity]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [TypeOrmModule]
})
export class RoleModule { }
