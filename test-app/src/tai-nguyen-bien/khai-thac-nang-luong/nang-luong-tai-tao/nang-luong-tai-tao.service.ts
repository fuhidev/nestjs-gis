import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NangLuongTaiTaoEntity } from './nang-luong-tai-tao.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class NangLuongTaiTaoService extends GISTypeOrmCrudService<NangLuongTaiTaoEntity>{

    constructor(@InjectRepository(NangLuongTaiTaoEntity) repo) {
        super(repo);
    }

}
