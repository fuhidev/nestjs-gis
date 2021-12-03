import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DmLoaiKhuBaoVeService } from './dm-loai-khu-bao-ve.service';
import { DmLoaiKhuBaoVeEntity } from './dm-loai-khu-bao-ve.entity';
import { RouteMetadata } from 'nestjs-gis'

@RouteMetadata()
@Crud({
    model:{type:DmLoaiKhuBaoVeEntity},
    params:{
      code: {
        field: 'code',
        primary: true,
        type: 'string',
      },
    }
})
@Controller('rest/dm-loai-khu-bao-ve')
export class DmLoaiKhuBaoVeController {

  constructor(private service: DmLoaiKhuBaoVeService) { }

}
