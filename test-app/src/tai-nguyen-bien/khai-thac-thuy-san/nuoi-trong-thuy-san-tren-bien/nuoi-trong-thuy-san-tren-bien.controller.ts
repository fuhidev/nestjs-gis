import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { NuoiTrongThuySanTrenBienService } from './nuoi-trong-thuy-san-tren-bien.service';
import { NuoiTrongThuySanTrenBienEntity } from './nuoi-trong-thuy-san-tren-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: NuoiTrongThuySanTrenBienEntity },
  params: {
    objectId: {
      field: 'objectId',
      type: 'number',
      primary: true,
    },
  },
})
@Controller('rest/nuoi-trong-thuy-san-tren-bien')
export class NuoiTrongThuySanTrenBienController {
  constructor(private service: NuoiTrongThuySanTrenBienService) {}
}
