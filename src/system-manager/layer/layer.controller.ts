import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  Patch,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import {
  Crud,
  CrudRequestInterceptor,
  ParsedRequest,
  Override,
  CreateManyDto,
} from '@nestjsx/crud';
import { LayerEntity } from './layer.entity';
import { LayerService } from './layer.service';
import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TableColumn } from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';

@UseGuards(JwtAuthGuard)
@Crud({
  model: { type: LayerEntity },
  params: {
    id: {
      field: 'layerId',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      dataset: {},
      fields: {},
      roles: {},
      'roles.role': {},
    },
  },
})
@Controller('sys/layer')
export class LayerController {
  constructor(private readonly service: LayerService) {}

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
  async getOneGDB(
    @Request() @ParsedRequest() req,
    @Param('id') layerId: string,
  ) {
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
  updateField(
    @Param('layerId') layerId: string,
    @Param('fieldId') fieldId: string,
    @Body() field,
  ) {
    if (!layerId) {
      throw new BadRequestException('Không xác định được layerId');
    }
    if (!fieldId) {
      throw new BadRequestException('Không xác định được fieldId');
    }
    if (!field) {
      throw new BadRequestException('Không xác định được body');
    }
    return this.service.updateField(layerId, fieldId, field);
  }

  @Patch('aliasfromgdb')
  @UsePipes(new ValidationPipe())
  updateAliasNameFromGDB(@Body() body) {
    return this.service.updateAliasNameFromGDB({ lstLayerId: body.lstLayerId });
  }

  @Get('column/:tableName')
  getColumns(@Param('tableName') tableName: string) {
    return this.service.getColumns(tableName);
  }
  @Get('hastable/:tableName')
  hasTable(@Param('tableName') tableName: string) {
    return this.service.hasTable({ tableName });
  }

  @Post('createtable')
  createTable(@Body() table: TableOptions & { tableType?: 'gis' }) {
    !table.columns && (table.columns = []);
    return this.service.createTable(table);
  }

  @Post('addColumn/:tableName')
  addColumn(@Body() column, @Param('tableName') tableName: string) {
    return this.service.addColumn({ tableName, column });
  }
  @Delete('dropColumn/:tableName/:columnName')
  dropColumn(
    @Param('columnName') columnName: string,
    @Param('tableName') tableName: string,
  ) {
    return this.service.dropColumn({ table: tableName, column: columnName });
  }

  @Patch('syncColumn/:tableName')
  syncColumn(
    @Body() columns: Array<TableColumn>,
    @Param('tableName') table: string,
  ) {
    return this.service.syncColumn({ table, columns });
  }

  @Get('columndatatype')
  getColumnDataType() {
    return this.service.getColumnType();
  }

  @Patch('columnDisplay/:table')
  updateColumnDisplay(@Param('table') table: string, @Body() body) {
    if (!body.columnDisplay) {
      throw new BadRequestException('Body.columnDisplay không được null');
    }
    return this.service.changeIsDiplayColumn({
      table,
      columnDisplay: body.columnDisplay,
    });
  }
}
