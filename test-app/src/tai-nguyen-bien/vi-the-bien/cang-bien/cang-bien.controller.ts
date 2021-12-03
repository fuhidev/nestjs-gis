import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CangBienService } from './cang-bien.service';
import { CangBienEntity } from './cang-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: CangBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      loai: {},
    },
  },
})
@Controller('rest/cang-bien')
export class CangBienController {
  constructor(private service: CangBienService) {}

  ngOnInit() {}
}
