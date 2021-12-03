import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DaDangSinhHocThuySanService } from './da-dang-sinh-hoc-thuy-san.service';
import { DaDangSinhHocThuySanEntity } from './da-dang-sinh-hoc-thuy-san.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DaDangSinhHocThuySanEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      loai: {},
    },
  },
})
@Controller('rest/da-dang-sinh-hoc-thuy-san')
export class DaDangSinhHocThuySanController {
  constructor(private service: DaDangSinhHocThuySanService) {}

  ngOnInit() {}
}
