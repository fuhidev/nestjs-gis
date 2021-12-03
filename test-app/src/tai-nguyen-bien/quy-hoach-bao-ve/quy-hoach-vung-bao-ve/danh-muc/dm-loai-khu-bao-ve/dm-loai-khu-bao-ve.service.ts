import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmLoaiKhuBaoVeEntity } from './dm-loai-khu-bao-ve.entity';

@Injectable()
export class DmLoaiKhuBaoVeService extends TypeOrmCrudService<DmLoaiKhuBaoVeEntity>{

    constructor(@InjectRepository(DmLoaiKhuBaoVeEntity) repo) {
        super(repo);
    }

}
