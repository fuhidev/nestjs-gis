import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DiaVatBienService } from './dia-vat-bien.service';
import { DiaVatBienEntity } from './dia-vat-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DiaVatBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      loaiThachQuyen: {},
      loaiThuyQuyen: {},
    },
  },
})
@Controller('rest/dia-vat-bien')
export class DiaVatBienController {
  constructor(private service: DiaVatBienService) {}

  ngOnInit() {}
}
