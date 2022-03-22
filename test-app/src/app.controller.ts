import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColumnOptions, TableColumn } from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('column/:tableName')
  getColumns(@Param('tableName') tableName: string) {
    return this.appService.getColumns(tableName);
  }
  @Get('hastable/:tableName')
  hasTable(@Param('tableName') tableName: string) {
    return this.appService.hasTable({ tableName });
  }

  @Post('createtable')
  createTable(@Body() table: TableOptions & { tableType?: 'gis' }) {
    !table.columns && (table.columns = []);
    return this.appService.createTable(table);
  }

  @Post('addColumn/:tableName')
  addColumn(@Body() column, @Param('tableName') tableName: string) {
    return this.appService.addColumn({ tableName, column });
  }
  @Delete('dropColumn/:tableName/:columnName')
  dropColumn(
    @Param('columnName') columnName: string,
    @Param('tableName') tableName: string,
  ) {
    return this.appService.dropColumn({ table: tableName, column: columnName });
  }

  @Patch('syncColumn/:tableName')
  syncColumn(
    @Body() columns: Array<TableColumn>,
    @Param('tableName') table: string,
  ) {
    return this.appService.syncColumn({ table, columns });
  }

  @Get('columndatatype')
  getColumnDataType() {
    return this.appService.getColumnType();
  }
}
