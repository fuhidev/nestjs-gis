import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMCapDiTichEntity } from './dm-cap-di-tich.entity';
import { DMCapDiTichService } from './dm-cap-di-tich.service';

@RouteMetadata()
@Crud({
  model: { type: DMCapDiTichEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'string',
    },
  },
})
@Controller('rest/dm-cap-di-tich')
export class DMCapDiTichController {
  constructor(private service: DMCapDiTichService) {}
}
