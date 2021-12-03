import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhaiThacTaiNguyenDatService } from './khai-thac-tai-nguyen-dat.service';
import { KhaiThacTaiNguyenDatEntity } from './khai-thac-tai-nguyen-dat.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: KhaiThacTaiNguyenDatEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/khai-thac-tai-nguyen-dat')
export class KhaiThacTaiNguyenDatController {
  constructor(private service: KhaiThacTaiNguyenDatService) {}

  ngOnInit() {}
}
