import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { NhanChimBienService } from './nhan-chim-bien.service';
import { NhanChimBienEntity } from './nhan-chim-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: NhanChimBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      vatChatDuocNhanChims: {},
      'vatChatDuocNhanChims.ten': {},
    },
  },
})
@Controller('rest/nhan-chim-bien')
export class NhanChimBienController {
  constructor(private service: NhanChimBienService) {}

  ngOnInit() {}
}
