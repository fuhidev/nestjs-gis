import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DmLoaiCangService } from './dm-loai-cang.service';
import { DMLoaiCangEntity } from './dm-loai-cang.entity';
import { RouteMetadata } from 'nestjs-gis'

@RouteMetadata()
@Crud({
    model:{type:DMLoaiCangEntity},
    params:{
      code: {
        field: 'code',
        primary: true,
        type: 'string',
      },
    }
})
@Controller('rest/dm-loai-cang')
export class DmLoaiCangController {

  constructor(private service: DmLoaiCangService) { }

}
