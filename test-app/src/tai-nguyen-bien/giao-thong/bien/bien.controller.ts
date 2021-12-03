import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { BienService } from './bien.service';
import { BienEntity } from './bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: BienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/bien')
export class BienController {
  constructor(private service: BienService) {}

  ngOnInit() {}
}
