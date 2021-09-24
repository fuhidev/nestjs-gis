import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CayXanhService } from './cay-xanh.service';
import { CayXanhEntity } from './cay-xanh.entity';
import { GISCrud, RouteMetadata } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
    model:{type:CayXanhEntity},
    params:{
    }
})
@Controller('rest/cay-xanh')
export class CayXanhController {

  constructor(private service: CayXanhService) { }

  ngOnInit() {
  }

}
