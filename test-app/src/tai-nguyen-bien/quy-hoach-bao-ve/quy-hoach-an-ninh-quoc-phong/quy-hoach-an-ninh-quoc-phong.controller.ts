import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { QuyHoachAnNinhQuocPhongService } from './quy-hoach-an-ninh-quoc-phong.service';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-an-ninh-quoc-phong.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: QuyHoachAnNinhQuocPhongEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/quy-hoach-an-ninh-quoc-phong')
export class QuyHoachAnNinhQuocPhongController {
  constructor(private service: QuyHoachAnNinhQuocPhongService) {}

  ngOnInit() {}
}
