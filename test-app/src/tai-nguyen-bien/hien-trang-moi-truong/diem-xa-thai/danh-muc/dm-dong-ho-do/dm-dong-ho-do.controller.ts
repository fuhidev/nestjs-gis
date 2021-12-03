import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMDongHoDoEntity } from './dm-dong-ho-do.entity';
import { DMDongHoDoService } from './dm-dong-ho-do.service';

@RouteMetadata()
@Crud({
  model: { type: DMDongHoDoEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-dong-ho-do')
export class DMDongHoDoController {
  constructor(private service: DMDongHoDoService) {}
}
