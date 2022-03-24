import { CrudRequest } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { Envelope } from 'terraformer-arcgis-parser';
import { BaseEntity } from 'typeorm';
import { Geometry } from 'terraformer-arcgis-parser';
import { SpatialReference } from '../geometry';

export interface FilterGeoBody {
  geometry: Geometry | GeoJSON.GeometryObject;
  fGeo?: 'geojson' | 'esri';
  method?: SpatialMethodEnum;
}

export interface GISParsedRequestParams extends ParsedRequestParams {
  outSR: SpatialReference | number;
  bbox?: Envelope;
  filterGeo?: FilterGeoBody;
  fGeo?: 'geojson' | 'esri';
  inSR?: SpatialReference | number;
}

export interface GISCrudRequest extends CrudRequest {
  parsed: GISParsedRequestParams;
}

export class GISEntity extends BaseEntity {
  objectId: number;
}

export enum SpatialMethodEnum {
  Within = 'within',
  Intersects = 'intersects',
  Touches = 'touches',
}
