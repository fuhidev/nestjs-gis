import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMGiaiDoanEntity } from './dm-phan-loai.entity';

@Injectable()
export class DMPhanLoaiService extends TypeOrmCrudService<DMGiaiDoanEntity>{

    constructor(@InjectRepository(DMGiaiDoanEntity) repo) {
        super(repo);
    }

}
