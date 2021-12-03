import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DuongTrieuService } from './duong-trieu.service';
import { DuongTrieuEntity } from './duong-trieu.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
    model:{type:DuongTrieuEntity},
    params:{
      objectId: {
        primary: true,
        field: 'objectId',
        type: 'number',
      },
    },
    query:{
      join:{
        loaiDuongTrieu:{}
      }
    }
})
@Controller('rest/duong-trieu')
export class DuongTrieuController {
  constructor(private service: DuongTrieuService) {}

  ngOnInit() {}
}
