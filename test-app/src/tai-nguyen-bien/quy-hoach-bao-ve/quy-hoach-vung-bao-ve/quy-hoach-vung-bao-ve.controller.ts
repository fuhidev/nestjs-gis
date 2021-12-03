import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { QuyHoachVungBaoVeService } from './quy-hoach-vung-bao-ve.service';
import { QuyHoachVungBaoVeEntity } from './quy-hoach-vung-bao-ve.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
    model:{type:QuyHoachVungBaoVeEntity},
    params:{
      objectId: {
        primary: true,
        field: 'objectId',
        type: 'number',
      },
    },
    query:{
      join:{
        loaiKhu:{}
      }
    }
})
@Controller('rest/quy-hoach-vung-bao-ve')
export class QuyHoachVungBaoVeController {
  constructor(private service: QuyHoachVungBaoVeService) {}

  ngOnInit() {}
}
