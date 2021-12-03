import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhaiThacDuLichService } from './khai-thac-du-lich.service';
import { KhaiThacDuLichEntity } from './khai-thac-du-lich.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: KhaiThacDuLichEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/khai-thac-du-lich')
export class KhaiThacDuLichController {
  constructor(private service: KhaiThacDuLichService) {}

  ngOnInit() {}
}
