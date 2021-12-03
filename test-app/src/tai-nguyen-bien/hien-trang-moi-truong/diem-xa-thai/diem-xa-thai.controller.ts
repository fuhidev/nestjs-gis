import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DiemXaThaiService } from './diem-xa-thai.service';
import { DiemXaThaiEntity } from './diem-xa-thai.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DiemXaThaiEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
  query: {
    join: {
      dongHoDo: {},
    },
  },
})
@Controller('rest/diem-xa-thai')
export class DiemXaThaiController {
  constructor(private service: DiemXaThaiService) {}

  ngOnInit() {}
}
