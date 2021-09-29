import { Controller, Post, Get, Request, UseGuards, UseInterceptors, Body, Param, BadRequestException, NotFoundException, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { Crud, CrudRequestInterceptor, ParsedRequest, Override, CreateManyDto } from '@nestjsx/crud';
import { LayerEntity } from './layer.entity';
import { LayerService } from './layer.service';
import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Crud({
    model: { type: LayerEntity },
    params: {
        id: {
            field: 'layerId',
            type: 'string',
            primary: true
        }
    },
    query: {
        join: {
            dataset: {},
            fields: {},
            'roles': {},
            'roles.role': {},
        }
    },
})
@Controller('sys/layer')
export class LayerController {
    constructor(private readonly service: LayerService,
    ) { }

    @Get('group')
    async getGroup(@Request() req) {
        return this.service.getMany(req);
        // const data: LayerEntity[] = await this.service.getMany(req);
        // return _.groupBy(await , g => g.)
    }

    @Get('gdb')
    @UseInterceptors(new CrudRequestInterceptor())
    getManyGDB(@Request() @ParsedRequest() req) {
        return this.service.getManyGDB(req);
    }
    @Get('gdb/:id')
    @UseInterceptors(new CrudRequestInterceptor())
    async getOneGDB(@Request() @ParsedRequest() req, @Param('id') layerId: string) {
        if (layerId) {
            const result = await this.service.getOneGDB(layerId);
            if (result) {
                return result;
            } else {
                throw new NotFoundException();
            }
        } else {
            throw new NotFoundException();
        }
    }

    // @Override()
    // getMany(@ParsedRequest() req) {
    //     return this.service.getData(req);
    // }

    // @Override()
    // getOne(
    //     @Param() id: string,
    //     @ParsedRequest() req: CrudRequest) {
    //     return this.service.get(id);
    // }

    // @Post('xml')
    // @ApiBody({})
    // xml(@Body() xml){
    //     return this.service.xml(xml);
    // }
    @Post('gdb/alias/:layerId')
    updateAlias(@Param('layerId') layerId, @Body() body) {
        if (!layerId) {
            throw new BadRequestException('Không xác định được layerId');
        }
        const layerName = body.layerName;
        if (!layerName) {
            throw new BadRequestException('Không xác định được layerName');
        }

        return this.service.updateAlias(layerId, layerName);
    }

    @Get('gdb/:layerId/field')
    getFields(@Param('layerId') layerId) {
        return this.service.getFields(layerId);
    }

    @Post('gdb/:layerId/field/:fieldId')
    updateField(@Param('layerId') layerId: string, @Param('fieldId') fieldId: string, @Body() field) {
        if (!layerId) { throw new BadRequestException('Không xác định được layerId'); }
        if (!fieldId) { throw new BadRequestException('Không xác định được fieldId'); }
        if (!field) { throw new BadRequestException('Không xác định được body'); }
        return this.service.updateField(layerId, fieldId, field);
    }

    @Patch('aliasfromgdb')
    @UsePipes(new ValidationPipe())
    updateAliasNameFromGDB(@Body() body){
        return this.service.updateAliasNameFromGDB({lstLayerId:body.lstLayerId});
    }
}
