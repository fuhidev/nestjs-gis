import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DamPhaVenBienEntity } from './dam-pha-ven-bien.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class DamPhaVenBienService extends GISTypeOrmCrudService<DamPhaVenBienEntity>{

    constructor(@InjectRepository(DamPhaVenBienEntity) repo) {
        super(repo);
    }

}
