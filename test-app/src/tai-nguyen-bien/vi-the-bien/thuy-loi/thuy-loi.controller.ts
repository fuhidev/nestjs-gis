import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ThuyLoiService } from './thuy-loi.service';
import { ThuyLoiEntity } from './thuy-loi.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: ThuyLoiEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/thuy-loi')
export class ThuyLoiController {
  constructor(private service: ThuyLoiService) {}

  ngOnInit() {}
}
