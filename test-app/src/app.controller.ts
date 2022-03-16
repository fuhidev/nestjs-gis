import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ColumnOptions } from 'typeorm';
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
  createTable(@Body() table) {
    return this.appService.createTable(table);
  }

  @Post('addColumn/:tableName')
  addColumn(
    @Body() column,
    @Param('tableName') tableName: string,
  ) {
    return this.appService.addColumn({ tableName, column });
  }
}
