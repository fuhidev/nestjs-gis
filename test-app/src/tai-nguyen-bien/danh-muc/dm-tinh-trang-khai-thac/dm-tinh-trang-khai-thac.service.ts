import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMTinhTrangKhaiThacEntity } from './dm-tinh-trang-khai-thac.entity';

@Injectable()
export class DMTinhTrangKhaiThacService extends TypeOrmCrudService<
  DMTinhTrangKhaiThacEntity
> {
  constructor(@InjectRepository(DMTinhTrangKhaiThacEntity) repo) {
    super(repo);
  }
}
