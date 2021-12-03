import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { LyHoaBienService } from './ly-hoa-bien.service';
import { LyHoaBienEntity } from './ly-hoa-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: LyHoaBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/ly-hoa-bien')
export class LyHoaBienController {
  constructor(private service: LyHoaBienService) {}

  ngOnInit() {}
}
