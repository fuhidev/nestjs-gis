import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMKhuVucONhiemEntity } from './dm-khu-vuc-o-nhiem.entity';
import { DMKhuVucONhiemService } from './dm-khu-vuc-o-nhiem.service';

@RouteMetadata()
@Crud({
  model: { type: DMKhuVucONhiemEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-khu-vuc-o-nhiem')
export class DMKhuVucONhiemController {
  constructor(private service: DMKhuVucONhiemService) {}
}
