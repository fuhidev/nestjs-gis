import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KhuBaoTonEntity } from './khu-bao-ton.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class KhuBaoTonService extends GISTypeOrmCrudService<KhuBaoTonEntity> {
  constructor(@InjectRepository(KhuBaoTonEntity) repo) {
    super(repo);
  }
}
