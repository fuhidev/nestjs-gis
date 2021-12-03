import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMKhaiThacThuySanEntity } from './dm-khai-thac-thuy-san.entity';

@Injectable()
export class DMKhaiThacThuySanService extends TypeOrmCrudService<
  DMKhaiThacThuySanEntity
> {
  constructor(@InjectRepository(DMKhaiThacThuySanEntity) repo) {
    super(repo);
  }
}
