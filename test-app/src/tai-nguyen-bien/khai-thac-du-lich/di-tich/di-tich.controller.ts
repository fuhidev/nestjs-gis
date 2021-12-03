import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DiTichService } from './di-tich.service';
import { DiTichEntity } from './di-tich.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DiTichEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      cap: {},
    },
  },
})
@Controller('rest/di-tich')
export class DiTichController {
  constructor(private service: DiTichService) {}

  ngOnInit() {}
}
