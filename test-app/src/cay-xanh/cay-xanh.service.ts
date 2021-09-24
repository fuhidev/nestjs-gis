import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CayXanhEntity } from './cay-xanh.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class CayXanhService extends GISTypeOrmCrudService<CayXanhEntity> {
    constructor(@InjectRepository(CayXanhEntity) repo){
        super(repo)
    }
    
}
