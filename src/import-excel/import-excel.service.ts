import { BadRequestException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import fetch from 'node-fetch';
import * as arcgis from 'terraformer-arcgis-parser';
import { GeometryType, Metadata } from '../decorators/route-metadata.decorator';
import {
  equalSrs,
  SpatialReference,
} from '../geometry/arcgis/interfaces/spatial-reference';
import { ProjectGeometryService } from '../geometry/project-geometry/project-geometry.service';
import { moduleOptions } from '../token';
@Injectable()
export class ImportExcelService {
  protected geometryService = new ProjectGeometryService();
  public async getTemplate(p: { url: string; authorization?: string }) {
    const { url, authorization } = p;
    let baseUrl = this.getHostname(url);
    const workbook = new Workbook();
    // tao worksheet data
    const ws = workbook.addWorksheet('Ban mau');
    const metadata = await this.getMetadata(url, authorization);
    // tao cot
    let cidx = 1;
    for (const field of metadata.columns) {
      if (field.readonly) {
        continue;
      }
      const cell = ws.getCell(1, cidx);
      cell.value = field.alias;
      cell.protection = { locked: true };
      // tao dropdownlist nhung field co domain
      if (
        field.relation &&
        (field.relation.type === 'many-to-one' ||
          field.relation.type === 'one-to-one')
      ) {
        // lay 1000 rows
        let relationEntities = [];
        try {
          relationEntities = await fetch(
            baseUrl + '/' + field.relation.url,
          ).then(t => t.json());
        } catch (error) {}

        let formulae = `${
          field.relation.name
        }!$B$2:$B$${relationEntities.length + 1}`;
        for (let ridx = 2; ridx <= 1001; ridx++) {
          ws.getCell(ridx, cidx).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [formulae],
          };
        }

        const wsDM = workbook.addWorksheet(field.relation.name);
        // tao column

        wsDM.getCell(1, 1).value = field.relation.primaryColumn;
        wsDM.getCell(1, 2).value = field.relation.displayColumn;

        let ridx = 2;
        for (const entity of relationEntities) {
          wsDM.getCell(ridx, 1).value = entity[field.relation.primaryColumn];
          wsDM.getCell(ridx, 2).value = entity[field.relation.displayColumn];

          ridx++;
        }
      }

      cidx++;
    }

    if (metadata.geometryType === GeometryType.Point) {
      // them 2 cot x,y
      ws.getCell(1, cidx).value = 'X';
      ws.getCell(1, cidx + 1).value = 'Y';
      ws.columns.forEach((column, i) => {
        let maxlength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          let columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxlength) {
            maxlength = columnLength;
          }
        });

        column.width = maxlength < 10 ? 10 : maxlength;
      });
    }

    return workbook;
  }

  private getHostname(url: string) {
    let baseUrl = '';
    {
      let protocol = url.substring(0, url.indexOf('/') + 2);
      let tmpUrl = url;
      tmpUrl = tmpUrl.replace('http://', '').replace('https://', '');
      baseUrl = tmpUrl.substring(0, tmpUrl.indexOf('/'));
      baseUrl = protocol + baseUrl;
    }
    return baseUrl;
  }

  private async getMetadata(
    url: string,
    authorization?: string,
  ): Promise<Metadata> {
    const headers = {};
    if (authorization) {
      headers['Authorization'] = authorization;
    }
    return fetch(url + '/metadata', {
      method: 'GET',
      headers,
    }).then(t => t.json());
  }

  public async getExcelData(p: {
    file;
    srs: number | SpatialReference;
    outSRS?: number | SpatialReference;
  }) {
    let { file, srs, outSRS } = p;
    srs = srs || moduleOptions.srs;
    outSRS = outSRS || moduleOptions.srs;
    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new BadRequestException('file không đúng định dạng .xlsx');
    }

    const wb = new Workbook();
    await wb.xlsx.load(file.buffer);

    const ws = wb.worksheets[0];
    if (ws.rowCount < 2) {
      throw new BadRequestException(
        'Số lượng cột không đủ, bắt buộc phải có cột X và Y',
      );
    }
    let values: any[] = [];
    let columns: string[] = [];
    try {
      ws.getRow(1).eachCell(cell => {
        columns.push(cell.value as string);
      });
    } catch (error) {
      throw new BadRequestException('Tên cột không đúng định dạng');
    }
    for (let rIdx = 2; rIdx <= ws.rowCount; rIdx++) {
      let value = {};
      // lay X,Y de tao geometry
      let x, y;

      x = ws.getCell(rIdx, ws.columnCount - 1).value; // x la cot gan cuoi
      y = ws.getCell(rIdx, ws.columnCount).value; //y la cot cuoi
      // neu khong co x,y thi bo qua
      if (!(x && y)) {
        continue;
      }

      value['shape'] = {
        coordinates: [x, y],
        type: 'Point',
      } as GeoJSON.Point;
      if (ws.columnCount > 2) {
        columns.forEach((colName, cIdx) => {
          value[colName] = ws.getCell(rIdx, cIdx + 1).value;
        });
        values.push(value);
      }
    }
    if (!equalSrs(srs, outSRS)) {
      try {
        const geometries = values.map(m => m.shape);
        const {
          geometries: resGeometries,
        } = await this.geometryService.projectGeojson({
          inSR: srs,
          outSR: outSRS,
          geometries,
        });
        resGeometries.forEach((geo, idx) => {
          values[idx].shape = geo;
        });
      } catch (error) {
        throw new BadRequestException(
          'Có lỗi xảy ra trong quá trình chuyển hệ tọa độ, vui lòng kiểm tra lại dữ liệu',
        );
      }
    }
    return {
      data: values,
    };
  }

  public async importExcel(p: {
    url: string;
    file: Express.Multer.File;
    srs: string;
    authorization?: string;
  }) {
    let { file, url, srs, authorization } = p;

    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new BadRequestException('file không đúng định dạng .xlsx');
    }
    const hostname = this.getHostname(url);
    const metadata = await this.getMetadata(url);
    // neu feature import khong phai geometry thi bo qua
    if (metadata.geometryType !== GeometryType.Point) {
      throw new BadRequestException('Feature không phải kiểu dữ liệu điểm');
    }

    const wb = new Workbook();
    await wb.xlsx.load(file.buffer);

    const ws = wb.worksheets[0];
    // lay column
    // lay values
    const values: Array<any> = [];

    for (let rIdx = 2; rIdx <= ws.rowCount; rIdx++) {
      let value = {};
      // lay X,Y de tao geometry
      let x, y;

      x = ws.getCell(rIdx, ws.columnCount - 1).value; // x la cot gan cuoi
      y = ws.getCell(rIdx, ws.columnCount).value; //y la cot cuoi
      // neu khong co x,y thi bo qua
      if (!(x && y)) {
        continue;
      }
      value['shape'] = {
        x,
        y,
        spatialReference: srs === '2000' ? moduleOptions.srs : { wkid: 4326 },
      } as arcgis.Point;
      // value['NgayCapNhat'] = new Date().getTime();
      // value['NguoiCapNhat'] = username;
      values.push(value);
      for (let cIdx = 1; cIdx <= metadata.columns.length; cIdx++) {
        const field = metadata.columns[cIdx - 1];
        if (field.readonly) {
          continue;
        }
        let cellValue = ws.getCell(rIdx, cIdx).value;
        // neu domain thi lay code, neu khong co code thi set null
        if (
          field.relation &&
          (field.relation.type === 'many-to-one' ||
            field.relation.type === 'one-to-one')
        ) {
          try {
            const relationEntities = await fetch(
              `${hostname}/${field.relation.url}?filter=${
                field.relation.displayColumn
              }||$eq||${cellValue}`,
            ).then(t => t.json());
            if (relationEntities.length) {
              const entity = relationEntities[0];
              value[field.name] = entity[field.relation.primaryColumn];
            } else {
              value[field.name] = null;
            }
          } catch (error) {
            value[field.name] = null;
          }
        } else {
          value[field.name] = cellValue;
        }
      }
    }

    const result = await Promise.all(
      values.map(value => {
        return fetch(url + '?outSR=4326', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: authorization,
          },
          body: JSON.stringify(value),
        }).then(t => t.json());
      }),
    );

    return { data: result };
  }
}
