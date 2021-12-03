import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { TimSongService } from './tim-song.service';
import { TimSongEntity } from './tim-song.entity';
import { RouteMetadata } from 'nestjs-gis';

@RouteMetadata()
@Crud({
  model: { type: TimSongEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/tim-song')
export class TimSongController {
  constructor(private service: TimSongService) {}
}
