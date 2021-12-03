import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMLoaiMatGiaoThongEntity } from './dm-loai-mat-giao-thong.entity';
import { DMLoaiMatGiaoThongService } from './dm-loai-mat-giao-thong.service';

@RouteMetadata()
@Crud({
  model: { type: DMLoaiMatGiaoThongEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-loai-mat-giao-thong')
export class DMLoaiMatGiaoThongController {
  constructor(private service: DMLoaiMatGiaoThongService) {}
}
