import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DuongDinhBoService } from './duong-dinh-bo.service';
import { DuongDinhBoEntity } from './duong-dinh-bo.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DuongDinhBoEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/duong-dinh-bo')
export class DuongDinhBoController {
  constructor(private service: DuongDinhBoService) {}

  ngOnInit() {}
}
