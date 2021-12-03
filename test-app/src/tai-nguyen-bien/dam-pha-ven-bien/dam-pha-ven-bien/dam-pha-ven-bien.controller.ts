import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DamPhaVenBienService } from './dam-pha-ven-bien.service';
import { DamPhaVenBienEntity } from './dam-pha-ven-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DamPhaVenBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      loaiDamPha: {},
    },
  },
})
@Controller('rest/dam-pha-ven-bien')
export class DamPhaVenBienController {
  constructor(private service: DamPhaVenBienService) {}
}
