import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiKhuVucDichVuEntity } from './dm-loai-khu-vuc-dich-vu.entity';
import { DMLoaiKhuVucDichVuService } from './dm-loai-khu-vuc-dich-vu.service';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiKhuVucDichVuEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'string',
    },
  },
})
@Controller('rest/dm-loai-khu-vuc-dich-vu')
export class DMLoaiKhuVucDichVuController {
  constructor(private service: DMLoaiKhuVucDichVuService) {}
}
