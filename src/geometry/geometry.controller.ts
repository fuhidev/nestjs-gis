import { Body, Controller, Post } from '@nestjs/common';
import { GeometryService } from './geometry.service';
// import * as shp2json from 'shp2json';
import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';
@Controller('services/geometry')
export class GeometryController {
  constructor(private readonly service: GeometryService) {}

  @Post('project')
  getProject(@Body() body) {
    return this.service.project(body);
  }

  deleteFolderRecursive(directoryPath) {
    if (existsSync(directoryPath)) {
      readdirSync(directoryPath).forEach((file, index) => {
        const curPath = join(directoryPath, file);
        if (lstatSync(curPath).isDirectory()) {
          // recurse
          this.deleteFolderRecursive(curPath);
        } else {
          // delete file
          unlinkSync(curPath);
        }
      });
      rmdirSync(directoryPath);
    }
  }
}
