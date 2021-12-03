import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DiemRanSanHoService } from './diem-ran-san-ho.service';
import { DiemRanSanHoEntity } from './diem-ran-san-ho.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DiemRanSanHoEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/diem-ran-san-ho')
export class DiemRanSanHoController {
  constructor(private service: DiemRanSanHoService) {}

  ngOnInit() {}
}
