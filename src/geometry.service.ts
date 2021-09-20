import { Injectable, HttpService } from '@nestjs/common';
import { Geometry, SpatialReference } from 'terraformer-arcgis-parser';
import { ProjectGeometryParams } from './project-geometry/project-geometry.interface';
import { ProjectGeometryService } from './project-geometry/project-geometry.service';

@Injectable()
export class GeometryService {
  constructor(private projectGeometry: ProjectGeometryService) {}

  project(params: ProjectGeometryParams){
    return this.projectGeometry.project(params);
  }
}
