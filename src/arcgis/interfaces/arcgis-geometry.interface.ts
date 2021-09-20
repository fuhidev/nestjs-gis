import * as arcgis from 'terraformer-arcgis-parser';
export class Point implements arcgis.Geometry {
  x: number;
  y: number;
  spatialReference;
}

export enum GeometryTypeEnum {
  Point = 'esriGeometryPoint',
  MultiPoint = 'esriGeometryMultipoint',
  Polyline = 'esriGeometryPolyline',
  Polygon = 'esriGeometryPolygon',
}
