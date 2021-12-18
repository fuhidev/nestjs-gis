import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DomainGroupService } from './domain-group.service';
import { DomainGroupEntity } from './domain-group.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: { type: DomainGroupEntity },
  params: {
    domainGroupId: {
      field: 'domainGroupId',
      type: 'string',
      primary: true,
    },
  },
})
@UseGuards(JwtAuthGuard)
@Controller('sys/domain-group')
export class DomainGroupController {
  constructor(private service: DomainGroupService) {}
}
