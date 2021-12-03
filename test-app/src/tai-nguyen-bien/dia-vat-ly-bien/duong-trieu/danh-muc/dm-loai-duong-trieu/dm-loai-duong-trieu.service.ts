import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiDuongTrieuEntity } from './dm-loai-duong-trieu.entity';

@Injectable()
export class DmLoaiDuongTrieuService extends TypeOrmCrudService<DMLoaiDuongTrieuEntity>{

    constructor(@InjectRepository(DMLoaiDuongTrieuEntity) repo) {
        super(repo);
    }

}
