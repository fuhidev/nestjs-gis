import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HienTrangKhaiThacThuySanEntity } from './khai-thac-thuy-san.entity';
import { GISTypeOrmCrudService} from 'nestjs-gis'
@Injectable()
export class KhaiThacThuySanService extends GISTypeOrmCrudService<HienTrangKhaiThacThuySanEntity>{

    constructor(@InjectRepository(HienTrangKhaiThacThuySanEntity) repo) {
        super(repo);
    }

}
