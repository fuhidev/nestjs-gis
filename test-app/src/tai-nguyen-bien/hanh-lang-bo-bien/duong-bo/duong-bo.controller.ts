import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DuongBoService } from './duong-bo.service';
import { DuongBoEntity } from './duong-bo.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DuongBoEntity },
  params: {
    objectId: {
      type: 'number',
      field: 'objectId',
      primary: true,
    },
  },
})
@Controller('rest/duong-bo')
export class DuongBoController {
  constructor(private service: DuongBoService) {}
}
