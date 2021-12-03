import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { SinhThaiBienDamPhaService } from './sinh-thai-bien-dam-pha.service';
import { SinhThaiBienDamPhaEntity } from './sinh-thai-bien-dam-pha.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: SinhThaiBienDamPhaEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/sinh-thai-bien-dam-pha')
export class SinhThaiBienDamPhaController {
  constructor(private service: SinhThaiBienDamPhaService) {}

  ngOnInit() {}
}
