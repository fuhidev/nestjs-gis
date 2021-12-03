import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HanhLangBienEntity } from './hanh-lang-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class HanhLangBienService extends GISTypeOrmCrudService<
  HanhLangBienEntity
> {
  constructor(@InjectRepository(HanhLangBienEntity) repo) {
    super(repo);
  }
}
