import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiKhoangSanEntity } from './dm-loai-khoang-san.entity';

@Injectable()
export class DMLoaiKhoangSanService extends TypeOrmCrudService<
  DMLoaiKhoangSanEntity
> {
  constructor(@InjectRepository(DMLoaiKhoangSanEntity) repo) {
    super(repo);
  }
}
