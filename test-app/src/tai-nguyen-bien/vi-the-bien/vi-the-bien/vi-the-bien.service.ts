import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViTheBienEntity } from './vi-the-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class ViTheBienService extends GISTypeOrmCrudService<ViTheBienEntity> {
  constructor(@InjectRepository(ViTheBienEntity) repo) {
    super(repo);
  }
}
