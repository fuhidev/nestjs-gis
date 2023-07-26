import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { GISCrud, RouteMetadata } from 'nestjs-gis';
import { CayXanhEntity } from './cay-xanh.entity';
import { CayXanhService } from './cay-xanh.service';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: CayXanhEntity },
  params: {},
  routes: {
    exclude: ['getManyBase'],
  },
})
@Controller('rest/cay-xanh')
export class CayXanhController {
  constructor(private service: CayXanhService) {}

  ngOnInit() {}
}
