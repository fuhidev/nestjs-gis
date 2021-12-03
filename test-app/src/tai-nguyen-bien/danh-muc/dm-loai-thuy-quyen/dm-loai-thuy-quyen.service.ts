import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiThuyQuyenEntity } from './dm-loai-thuy-quyen.entity';

@Injectable()
export class DMLoaiThuyQuyenService extends TypeOrmCrudService<
  DMLoaiThuyQuyenEntity
> {
  constructor(@InjectRepository(DMLoaiThuyQuyenEntity) repo) {
    super(repo);
  }
}
