import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DmLoaiDuongTrieuService } from './dm-loai-duong-trieu.service';
import { DMLoaiDuongTrieuEntity } from './dm-loai-duong-trieu.entity';
import { RouteMetadata } from 'nestjs-gis'

@RouteMetadata()
@Crud({
    model:{type:DMLoaiDuongTrieuEntity},
    params:{
      code: {
        field: 'code',
        primary: true,
        type: 'number',
      },
    }
})
@Controller('rest/dm-loai-duong-trieu')
export class DmLoaiDuongTrieuController {

  constructor(private service: DmLoaiDuongTrieuService) { }

}
