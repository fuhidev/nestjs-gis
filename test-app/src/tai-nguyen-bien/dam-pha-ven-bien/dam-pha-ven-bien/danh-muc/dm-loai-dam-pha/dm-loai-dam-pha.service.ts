import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiDamPhaEntity } from './dm-loai-dam-pha.entity';

@Injectable()
export class DmLoaiDamPhaService extends TypeOrmCrudService<DMLoaiDamPhaEntity>{

    constructor(@InjectRepository(DMLoaiDamPhaEntity) repo) {
        super(repo);
    }

}
