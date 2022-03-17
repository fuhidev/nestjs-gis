import { Geometry } from 'terraformer-arcgis-parser';
import { GeometryTypeEnum } from '../arcgis/interfaces/arcgis-geometry.interface';
import { SpatialReference } from '../arcgis/interfaces/spatial-reference';

export class ProjectGeometryParams {
  inSR?: SpatialReference | number;
  outSR?: SpatialReference | number;
  geometryType:GeometryTypeEnum;
  geometries: Array<Geometry>;
}
export class ProjectGeometryGeojsonParams {
  inSR?: SpatialReference | number;
  outSR?: SpatialReference | number;
  geometries: Array<GeoJSON.GeometryObject>;
}
