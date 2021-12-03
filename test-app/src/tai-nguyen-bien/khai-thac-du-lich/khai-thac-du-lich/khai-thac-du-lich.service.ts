import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KhaiThacDuLichEntity } from './khai-thac-du-lich.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class KhaiThacDuLichService extends GISTypeOrmCrudService<
  KhaiThacDuLichEntity
> {
  constructor(@InjectRepository(KhaiThacDuLichEntity) repo) {
    super(repo);
  }
}
