import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RoleLayerEntity } from './role-layer.entity';
import { RoleLayerService } from './role-layer.service';

@Crud({
  model: { type: RoleLayerEntity },
  params: {
    id: {
      primary: true,
      field: 'id',
      type: 'uuid'
    }
  },
  query:{
    join:{
      layer:{},
    }
  }
})
@Controller('sys/role-layer')
export class RoleLayerController {
  constructor(private readonly service: RoleLayerService) { }
}
