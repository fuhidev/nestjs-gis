import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NhanChimBienVatChatEntity } from './nhan-chim-bien-vat-chat.entity';

@Injectable()
export class NhanChimBienVatChatService extends TypeOrmCrudService<
  NhanChimBienVatChatEntity
> {
  constructor(@InjectRepository(NhanChimBienVatChatEntity) repo) {
    super(repo);
  }
}
