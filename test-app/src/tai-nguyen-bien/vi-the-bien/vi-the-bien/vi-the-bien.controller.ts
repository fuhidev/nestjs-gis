import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ViTheBienService } from './vi-the-bien.service';
import { ViTheBienEntity } from './vi-the-bien.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: ViTheBienEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/vi-the-bien')
export class ViTheBienController {
  constructor(private service: ViTheBienService) {}

  ngOnInit() {}
}
