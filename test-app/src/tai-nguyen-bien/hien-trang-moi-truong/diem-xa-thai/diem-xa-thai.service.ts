import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiemXaThaiEntity } from './diem-xa-thai.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DiemXaThaiService extends GISTypeOrmCrudService<DiemXaThaiEntity> {
  constructor(@InjectRepository(DiemXaThaiEntity) repo) {
    super(repo);
  }
}
