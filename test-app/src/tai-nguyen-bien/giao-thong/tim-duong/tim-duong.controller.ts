import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { TimDuongService } from './tim-duong.service';
import { TimDuongEntity } from './tim-duong.entity';
import { RouteMetadata } from 'nestjs-gis';

@RouteMetadata()
@Crud({
  model: { type: TimDuongEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/tim-duong')
export class TimDuongController {
  constructor(private service: TimDuongService) {}
}
