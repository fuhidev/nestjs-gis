import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { QuyHoachVungDichVuService } from './quy-hoach-vung-dich-vu.service';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-vung-dich-vu.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis'

@RouteMetadata()
@GISCrud()
@Crud({
    model:{type:QuyHoachAnNinhQuocPhongEntity},
    params:{
      objectId: {
        primary: true,
        field: 'objectId',
        type: 'number',
      },
  },
  query: {
    join: {
      loaiKhu: {},
    },
  },
})
@Controller('rest/quy-hoach-vung-dich-vu')
export class QuyHoachVungDichVuController {
  constructor(private service: QuyHoachVungDichVuService) {}

  ngOnInit() {}
}
