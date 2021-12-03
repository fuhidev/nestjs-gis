import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMVatChatNhanChimEntity } from './dm-vat-chat-nhan-chim.entity';

@Injectable()
export class DMVatChatNhanChimService extends TypeOrmCrudService<
  DMVatChatNhanChimEntity
> {
  constructor(@InjectRepository(DMVatChatNhanChimEntity) repo) {
    super(repo);
  }
}
