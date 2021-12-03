import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhaiThacThuySanService } from './khai-thac-thuy-san.service';
import { HienTrangKhaiThacThuySanEntity } from './khai-thac-thuy-san.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: HienTrangKhaiThacThuySanEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      doiTuong: {},
      giaiDoan: {},
    },
  },
})
@Controller('rest/khai-thac-thuy-san')
export class KhaiThacThuySanController {
  constructor(private service: KhaiThacThuySanService) {}

  ngOnInit() {}
}
