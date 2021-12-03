import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SinhThaiBienDamPhaEntity } from './sinh-thai-bien-dam-pha.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class SinhThaiBienDamPhaService extends GISTypeOrmCrudService<
  SinhThaiBienDamPhaEntity
> {
  constructor(@InjectRepository(SinhThaiBienDamPhaEntity) repo) {
    super(repo);
  }
}
