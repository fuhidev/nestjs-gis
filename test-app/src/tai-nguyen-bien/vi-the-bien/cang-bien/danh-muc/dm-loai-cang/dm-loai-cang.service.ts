import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiCangEntity } from './dm-loai-cang.entity';

@Injectable()
export class DmLoaiCangService extends TypeOrmCrudService<DMLoaiCangEntity>{

    constructor(@InjectRepository(DMLoaiCangEntity) repo) {
        super(repo);
    }

}
