import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiemRanSanHoEntity } from './diem-ran-san-ho.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DiemRanSanHoService extends GISTypeOrmCrudService<
  DiemRanSanHoEntity
> {
  constructor(@InjectRepository(DiemRanSanHoEntity) repo) {
    super(repo);
  }
}
