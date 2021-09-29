import { Controller, Get, UseInterceptors, Request, UseGuards, Body, Header, Res } from '@nestjs/common';
import { Crud, CrudRequestInterceptor, ParsedRequest, Override, CrudRequest } from '@nestjsx/crud';
import { LoggerEntity } from './logger.entity';
import { LoggerService } from './logger.service';
import { LoggerActionTypeService } from './logger.action-type.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Crud({
    model: { type: LoggerEntity },
    params: {
        id: {
            field: 'LoggerId',
            primary: true,
            type: 'uuid'
        }
    },
    routes: {
        exclude: ['createManyBase', 'replaceOneBase', 'updateOneBase']
    },
    query: {
        join: {
            user: {},
            actionType: {},
            table: {}
        },
        sort: [
            { field: 'createDate', order: 'DESC' }
        ]
    }
})
@Controller('sys/logger')
export class LoggerController {
    constructor(private service: LoggerService,
        private actionTypeService: LoggerActionTypeService) { }

    @Get('action-type')
    @UseInterceptors(new CrudRequestInterceptor())
    getManyActionType(@Request() @ParsedRequest() req) {
        return this.actionTypeService.getMany(req);
    }

    @UseGuards(JwtAuthGuard)
    @Override()
    createOne(@Request() req: CrudRequest, @Body() dto: LoggerEntity) {
        dto.userId = (req as any).user.userId;
        return this.service.repo.save(this.service.repo.create(dto));
    }

    // @Get('export/xlsx')
    // @UseInterceptors(CrudRequestInterceptor)
    // async  exportXlsx(
    //     @Request() @ParsedRequest() req,
    //     @Res() res
    // ) {
    //     const filename = `logger${new Date().getTime()}.xlsx`;
    //     res.set({
    //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition': `attachment; filename=${filename}`
    //     })
    //     const wb = await this.service.exportXlsx(req);
    //     wb.write(filename, res);
    // }
}
