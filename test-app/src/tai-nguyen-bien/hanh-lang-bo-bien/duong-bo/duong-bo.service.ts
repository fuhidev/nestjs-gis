import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuongBoEntity } from './duong-bo.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class DuongBoService extends GISTypeOrmCrudService<DuongBoEntity>{

    constructor(@InjectRepository(DuongBoEntity) repo) {
        super(repo);
    }

}
