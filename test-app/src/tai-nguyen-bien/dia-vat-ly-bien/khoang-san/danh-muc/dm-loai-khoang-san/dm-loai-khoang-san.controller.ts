import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DMLoaiKhoangSanEntity } from './dm-loai-khoang-san.entity';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiKhoangSanService } from './dm-loai-khoang-san.service';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiKhoangSanEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-loai-khoang-san')
export class DMLoaiKhoangSanController {
  constructor(private service: DMLoaiKhoangSanService) {}
}
