import { Controller, Post, Get, Request, UseInterceptors, Param, Body, BadRequestException, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { DatasetService } from './dataset.service';
import { Crud, ParsedRequest, CrudRequestInterceptor } from '@nestjsx/crud';
import { DatasetEntity } from './dataset.entity';

@Crud({
    model: {
        type: DatasetEntity
    },
    params: {
        id: {
            field: 'datasetId',
            type: 'string',
            primary: true
        }
    },
    query: {
        join: {
            layers: {}
        }
    }
})
@Controller('sys/dataset')
export class DatasetController {
    constructor(private readonly service: DatasetService) {

    }

    // @Post('load')
    // reload(){
    //     return this.service.reload();
    // }

    @Get('gdb')
    @UseInterceptors(new CrudRequestInterceptor())
    getDataGDB(@Request() @ParsedRequest() req) {
        return this.service.getDataGDB(req);
    }

    @Post('gdb/alias/:datasetId')
    updateAlias(@Param('datasetId') datasetId, @Body() body) {
        if (!datasetId) {
            throw new BadRequestException('Không xác định được datasetId');
        }
        const datasetName = body.datasetName;
        if (!datasetName) {
            throw new BadRequestException('Không xác định được datasetName');
        }

        return this.service.updateAlias(datasetId, datasetName);
    }

    @Patch('aliasfromgdb')
    @UsePipes(new ValidationPipe())
    updateAliasNameFromGDB(@Body() body){
        return this.service.updateAliasNameFromGDB({lstDatasetId:body.lstDatasetId});
    }
}
