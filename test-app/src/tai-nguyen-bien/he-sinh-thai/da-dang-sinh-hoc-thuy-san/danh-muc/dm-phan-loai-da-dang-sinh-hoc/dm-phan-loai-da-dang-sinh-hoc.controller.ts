import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMPhanLoaiDDSH } from './dm-phan-loai-da-dang-sinh-hoc.entity';
import { DMPhanLoaiDaDangSinhHocService } from './dm-phan-loai-da-dang-sinh-hoc.service';

@RouteMetadata()
@Crud({
  model: { type: DMPhanLoaiDDSH },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-phan-loai-da-dang-sinh-hoc')
export class DMPhanLoaiDaDangSinhHocController {
  constructor(private service: DMPhanLoaiDaDangSinhHocService) {}
}
