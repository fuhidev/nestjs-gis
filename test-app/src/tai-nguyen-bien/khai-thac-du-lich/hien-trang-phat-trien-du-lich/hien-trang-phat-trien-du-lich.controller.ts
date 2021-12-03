import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { HienTrangPhatTrienDuLichService } from './hien-trang-phat-trien-du-lich.service';
import { HienTrangPhatTrienDuLichEntity } from './hien-trang-phat-trien-du-lich.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: HienTrangPhatTrienDuLichEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/hien-trang-phat-trien-du-lich')
export class HienTrangPhatTrienDuLichController {
  constructor(private service: HienTrangPhatTrienDuLichService) {}

  ngOnInit() {}
}
