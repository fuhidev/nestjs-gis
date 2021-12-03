import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiThuyQuyenEntity } from './dm-loai-thuy-quyen.entity';
import { DMLoaiThuyQuyenService } from './dm-loai-thuy-quyen.service';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiThuyQuyenEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-loai-thuy-quyen')
export class DMLoaiThuyQuyenController {
  constructor(private service: DMLoaiThuyQuyenService) {}
}
