import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HanhLangBaoVeBoBienEntity } from './hanh-lang-bao-ve-bo-bien.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class HanhLangBaoVeBoBienService extends GISTypeOrmCrudService<HanhLangBaoVeBoBienEntity>{

    constructor(@InjectRepository(HanhLangBaoVeBoBienEntity) repo) {
        super(repo);
    }

}
