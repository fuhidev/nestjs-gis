import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMPhanLoaiDDSH } from './dm-phan-loai-da-dang-sinh-hoc.entity';

@Injectable()
export class DMPhanLoaiDaDangSinhHocService extends TypeOrmCrudService<
  DMPhanLoaiDDSH
> {
  constructor(@InjectRepository(DMPhanLoaiDDSH) repo) {
    super(repo);
  }
}
