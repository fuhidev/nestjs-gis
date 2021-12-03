import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaChatEntity } from './dia-chat.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DiaChatService extends GISTypeOrmCrudService<DiaChatEntity> {
  constructor(@InjectRepository(DiaChatEntity) repo) {
    super(repo);
  }
}
