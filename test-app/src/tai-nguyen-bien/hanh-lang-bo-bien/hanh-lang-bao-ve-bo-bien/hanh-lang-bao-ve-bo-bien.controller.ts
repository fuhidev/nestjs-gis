import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { HanhLangBaoVeBoBienService } from './hanh-lang-bao-ve-bo-bien.service';
import { HanhLangBaoVeBoBienEntity } from './hanh-lang-bao-ve-bo-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: HanhLangBaoVeBoBienEntity },
  params: {
    objectId: {
      type: 'number',
      field: 'OBJECTID',
      primary: true,
    },
  },
})
@Controller('rest/hanh-lang-bao-ve-bo-bien')
export class HanhLangBaoVeBoBienController {
  constructor(private service: HanhLangBaoVeBoBienService) {}
}
