import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhuVucONhiemService } from './khu-vuc-o-nhiem.service';
import { KhuVucONhiemEntity } from './khu-vuc-o-nhiem.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: KhuVucONhiemEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      loaiKhuVuc: {},
    },
  },
})
@Controller('rest/khu-vuc-o-nhiem')
export class KhuVucONhiemController {
  constructor(private service: KhuVucONhiemService) {}

  ngOnInit() {}
}
