import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { GiaoThongService } from './giao-thong.service';
import { GiaoThongEntity } from './giao-thong.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: GiaoThongEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/giao-thong')
export class GiaoThongController {
  constructor(private service: GiaoThongService) {}

  ngOnInit() {}
}
