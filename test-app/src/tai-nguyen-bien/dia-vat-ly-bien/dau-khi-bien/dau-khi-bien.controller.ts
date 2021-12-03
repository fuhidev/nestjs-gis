import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DauKhiBienService } from './dau-khi-bien.service';
import { DauKhiBienEntity } from './dau-khi-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DauKhiBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      tinhTrangKhaiThac: {},
    },
  },
})
@Controller('rest/dau-khi-bien')
export class DauKhiBienController {
  constructor(private service: DauKhiBienService) {}

  ngOnInit() {}
}
