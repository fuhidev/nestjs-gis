import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { BaiTamService } from './bai-tam.service';
import { BaiTamEntity } from './bai-tam.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: BaiTamEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/bai-tam')
export class BaiTamController {
  constructor(private service: BaiTamService) {}

  ngOnInit() {}
}
