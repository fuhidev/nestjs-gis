import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DMGiaiDoanEntity } from './dm-phan-loai.entity';
import { RouteMetadata } from 'nestjs-gis'
import { DMPhanLoaiService } from './dm-phan-loai.service';

@RouteMetadata()
@Crud({
    model:{type:DMGiaiDoanEntity},
    params:{
      code: {
        field: 'code',
        primary: true,
        type: 'number',
      },
    }
})
@Controller('rest/dm-giai-doan')
export class DMPhanLoaiController {
  constructor(private service: DMPhanLoaiService) {}
}
