import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleLayerEntity } from './role-layer.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class RoleLayerService extends TypeOrmCrudService<RoleLayerEntity>{
  constructor(
    @InjectRepository(RoleLayerEntity) repo
  ) {
    super(repo);
  }
}
