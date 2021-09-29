import { Controller, UseGuards } from '@nestjs/common';
import { ApplicationGroupService } from './application-group.service';
import { Crud } from '@nestjsx/crud';
import { ApplicationGroupEntity } from './application-group.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Crud({
    model: { type: ApplicationGroupEntity },
    query: {
        join: {
            parent: {},
            'parent.parent': {},
            childs: {},
            'childs.application': {},
            applications: {},
        }
    },
    params: {
        id: {
            primary: true,
            field: 'applicationGroupId',
            type: 'uuid'
        }
    }
})
@Controller('sys/application-group')
export class ApplicationGroupController {
    constructor(private service: ApplicationGroupService) {

    }
}
