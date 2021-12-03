import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-vung-dich-vu.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class QuyHoachVungDichVuService extends GISTypeOrmCrudService<QuyHoachAnNinhQuocPhongEntity>{

    constructor(@InjectRepository(QuyHoachAnNinhQuocPhongEntity) repo) {
        super(repo);
    }

}
