import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { PhanBoTramTichService } from './phan-bo-tram-tich.service';
import { PhanBoTramTichEntity } from './phan-bo-tram-tich.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: PhanBoTramTichEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/phan-bo-tram-tich')
export class PhanBoTramTichController {
  constructor(private service: PhanBoTramTichService) {}

  ngOnInit() {}
}
