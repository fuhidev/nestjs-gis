import * as arcgis from 'terraformer-arcgis-parser';
export class Point implements arcgis.Geometry {
  x: number;
  y: number;
  spatialReference;
}

export enum GeometryTypeEnum {
  Point = 'GeometryPoint',
  MultiPoint = 'GeometryMultipoint',
  Polyline = 'GeometryPolyline',
  Polygon = 'GeometryPolygon',
  Envelope = 'GeometryEnvelope'
}
