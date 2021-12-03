import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DMKhaiThacThuySanService } from './dm-khai-thac-thuy-san.service';
import { DMKhaiThacThuySanEntity } from './dm-khai-thac-thuy-san.entity';
import { RouteMetadata } from 'nestjs-gis';

@RouteMetadata()
@Crud({
  model: { type: DMKhaiThacThuySanEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'string',
    },
  },
})
@Controller('rest/dm-khai-thac-thuy-san')
export class DMKhaiThacThuySanController {
  constructor(private service: DMKhaiThacThuySanService) {}
}
