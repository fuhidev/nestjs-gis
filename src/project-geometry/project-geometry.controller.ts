import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProjectGeometryGeojsonParams, ProjectGeometryParams } from './project-geometry.interface';
import { ProjectGeometryService } from './project-geometry.service';

@Controller('services/project')
export class ProjectGeometryController {
  constructor(private readonly service: ProjectGeometryService) {}

  @Post()
  @HttpCode(200)
  project(@Body() body: ProjectGeometryParams) {
    return this.service.project(body);
  }
  @Post('geojson')
  @HttpCode(200)
  projectGeojson(@Body() body: ProjectGeometryGeojsonParams) {
    return this.service.projectGeojson(body);
  }
}
