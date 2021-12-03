import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhoangSanService } from './khoang-san.service';
import { KhoangSanEntity } from './khoang-san.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: KhoangSanEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
    query:{
      join:{
loaiKhoangSan:{},
giaiDoan:{},
tinhTrangKhaiThac:{}
      }
    }
})
@Controller('rest/khoang-san')
export class KhoangSanController {
  constructor(private service: KhoangSanService) {}

  ngOnInit() {}
}
