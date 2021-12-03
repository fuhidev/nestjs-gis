import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NuoiTrongThuySanTrenBienEntity } from './nuoi-trong-thuy-san-tren-bien.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class NuoiTrongThuySanTrenBienService extends GISTypeOrmCrudService<NuoiTrongThuySanTrenBienEntity>{

    constructor(@InjectRepository(NuoiTrongThuySanTrenBienEntity) repo) {
        super(repo);
    }

}
