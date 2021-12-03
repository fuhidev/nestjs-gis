import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { NangLuongTaiTaoService } from './nang-luong-tai-tao.service';
import { NangLuongTaiTaoEntity } from './nang-luong-tai-tao.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: NangLuongTaiTaoEntity },
  params: {
    objectId: { type: 'number', primary: true, field: 'objectId' },
  },
})
@Controller('rest/nang-luong-tai-tao')
export class NangLuongTaiTaoController {
  constructor(private service: NangLuongTaiTaoService) {}
}
