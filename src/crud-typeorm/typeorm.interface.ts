import { CrudRequest } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { SpatialReference } from '../arcgis/interfaces/spatial-reference';
import { Envelope } from 'terraformer-arcgis-parser';
import { BaseEntity } from 'typeorm';
import { Geometry } from 'terraformer-arcgis-parser';

export interface FilterGeoBody{
  geometry: Geometry | GeoJSON.GeometryObject;
  fGeo?:'geojson' | 'esri'
}

export interface GISParsedRequestParams extends ParsedRequestParams {
  outSR: SpatialReference | number;
  bbox?: Envelope;
  filterGeo?: FilterGeoBody;
  fGeo?: 'geojson' | 'esri';
}

export interface GISCrudRequest extends CrudRequest {
  parsed: GISParsedRequestParams;
}

export class GISEntity extends BaseEntity {
  objectId: number;
}
