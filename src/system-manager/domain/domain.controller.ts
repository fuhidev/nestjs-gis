import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DomainService } from './domain.service';
import { DomainEntity } from './domain.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: { type: DomainEntity },
  params: {
    domainId: {
      field: 'domainId',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      domainGroup: {},
    },
  },
})
@UseGuards(JwtAuthGuard)
@Controller('sys/domain')
export class DomainController {
  constructor(private service: DomainService) {}
}
