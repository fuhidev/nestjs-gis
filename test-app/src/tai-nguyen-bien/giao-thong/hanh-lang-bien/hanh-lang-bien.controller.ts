import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { HanhLangBienService } from './hanh-lang-bien.service';
import { HanhLangBienEntity } from './hanh-lang-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: HanhLangBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/hanh-lang-bien')
export class HanhLangBienController {
  constructor(private service: HanhLangBienService) {}

  ngOnInit() {}
}
