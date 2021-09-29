import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ApplicationEntity } from './application.entity';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Crud({
    model: { type: ApplicationEntity },
    query: {
        join: {
            applicationGroup: {}
        }
    },
    params: {
        id: {
            field: 'applicationId',
            primary: true,
            type: 'string'
        }
    }
})
@Controller('sys/application')
export class ApplicationController {
    constructor(private service: ApplicationService) {

    }
}
