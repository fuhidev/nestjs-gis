import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DuongDangSauService } from './duong-dang-sau.service';
import { DuongDangSauEntity } from './duong-dang-sau.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DuongDangSauEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/duong-dang-sau')
export class DuongDangSauController {
  constructor(private service: DuongDangSauService) {}

  ngOnInit() {}
}
