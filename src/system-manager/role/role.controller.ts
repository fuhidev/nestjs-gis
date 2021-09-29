import { Controller, UseGuards, Post, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BodySyncLayers } from './role.interface';

@UseGuards(JwtAuthGuard)
@Crud({
    model: { type: RoleEntity },
    params: {
        id: {
            field: 'roleId',
            primary: true,
            type: 'uuid'
        }
    },
    query: {
        join: {
            users: {},
            roleParent: {},
            applications: {},
            layers: {},
            'layers.layer': {},
            'layers.layer.dataset': {}
        }
    }
})
@Controller('sys/role')
export class RoleController {
    constructor(private service: RoleService) { }

    @Post('sync-layer/:roleId')
    @UsePipes(new ValidationPipe())
    syncLayers(@Param('roleId') roleId: string, @Body() body: BodySyncLayers) {
        return this.service.syncLayers({ roleId, lstDatasetId: body.lstDatasetId });
    }
}
