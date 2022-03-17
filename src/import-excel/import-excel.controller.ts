import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpatialReference } from '../geometry/arcgis';
import { ImportExcelService } from './import-excel.service';

@Controller('gis/import-excel')
export class ImportExcelController {
  constructor(private service: ImportExcelService) {}
  @Get('template')
  async getTemplate(@Res() res, @Query('url') url: string) {
    var fileName = 'filemau.xlsx';
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    const workbook = await this.service.getTemplate({ url });
    await workbook.xlsx.write(res);
    res.end();
  }

  @Post('import')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  docFileExcel(
    @UploadedFile() file,
    @Query('url') url: string,
    @Query('srs') srs: string,
  ) {
    return this.service.importExcel({ url, file, srs });
  }
  @Post('exceldata')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  getExcelData(
    @UploadedFile() file,
    @Query('srs') srs: SpatialReference | number,
    @Query('outsrs') outSRS: SpatialReference | number,
  ) {
    return this.service.getExcelData({ file, srs,outSRS });
  }
}
