import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DMTinhTrangKhaiThacService } from './dm-tinh-trang-khai-thac.service';
import { RouteMetadata } from 'nestjs-gis';
import { DMTinhTrangKhaiThacEntity } from './dm-tinh-trang-khai-thac.entity';

@RouteMetadata()
@Crud({
  model: { type: DMTinhTrangKhaiThacEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-tinh-trang-khai-thac')
export class DMTinhTrangKhaiThacController {
  constructor(private service: DMTinhTrangKhaiThacService) {}
}
