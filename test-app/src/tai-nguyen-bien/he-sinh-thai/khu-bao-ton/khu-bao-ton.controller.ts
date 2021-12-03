import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { KhuBaoTonService } from './khu-bao-ton.service';
import { KhuBaoTonEntity } from './khu-bao-ton.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: KhuBaoTonEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/khu-bao-ton')
export class KhuBaoTonController {
  constructor(private service: KhuBaoTonService) {}

  ngOnInit() {}
}
