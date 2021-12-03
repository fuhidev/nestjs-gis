import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { QuyHoachPhatTrienDuLichService } from './quy-hoach-phat-trien-du-lich.service';
import { QuyHoachPhatTrienDuLichEntity } from './quy-hoach-phat-trien-du-lich.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: QuyHoachPhatTrienDuLichEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/quy-hoach-phat-trien-du-lich')
export class QuyHoachPhatTrienDuLichController {
  constructor(private service: QuyHoachPhatTrienDuLichService) {}

  ngOnInit() {}
}
