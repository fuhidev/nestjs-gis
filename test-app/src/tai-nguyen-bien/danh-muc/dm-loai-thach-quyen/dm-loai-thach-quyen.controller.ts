import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DMLoaiThachQuyenEntity } from './dm-loai-thach-quyen.entity';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiThachQuyenService } from './dm-loai-thach-quyen.service';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiThachQuyenEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-loai-thach-quyen')
export class DMLoaiThachQuyenController {
  constructor(private service: DMLoaiThachQuyenService) {}
}
