import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DmLoaiDamPhaService } from './dm-loai-dam-pha.service';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiDamPhaEntity } from './dm-loai-dam-pha.entity';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiDamPhaEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  }
})
@Controller('rest/dm-loai-dam-pha')
export class DmLoaiDamPhaController {
  constructor(private service: DmLoaiDamPhaService) {}
}
