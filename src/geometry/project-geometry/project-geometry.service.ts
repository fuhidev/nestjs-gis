import { Injectable } from '@nestjs/common';
import { GeometryObject } from 'geojson';
import fetch from 'node-fetch';
import * as arcgis from 'terraformer-arcgis-parser';
import { Geometry } from 'terraformer-arcgis-parser';
import { moduleOptions } from '../../token';
import { GeometryTypeEnum } from '../arcgis';
import {
  ProjectGeometryGeojsonParams,
  ProjectGeometryParams,
} from './project-geometry.interface';
@Injectable()
export class ProjectGeometryService {
  get options() {
    return moduleOptions;
  }
  constructor() {}
  async projectGeojson(
    params: ProjectGeometryGeojsonParams,
  ): Promise<{ geometries: GeometryObject[] }> {
    // chuyển cấu trúc geometry geojson > arcgis
    const { inSR, outSR, geometries } = params;
    const firstGeo = geometries[0];
    const geometryType =
      firstGeo.type === 'Point' || firstGeo.type === 'MultiPoint'
        ? GeometryTypeEnum.Point
        : firstGeo.type === 'LineString' || firstGeo.type === 'MultiLineString'
        ? GeometryTypeEnum.Polyline
        : firstGeo.type === 'Polygon' || firstGeo.type === 'MultiPolygon'
        ? GeometryTypeEnum.Polygon
        : null;
    const arcgisGeometries = geometries.map(geo => arcgis.convert(geo));
    const { geometries: arcgisGeoProj } = await this.project({
      geometries: arcgisGeometries,
      geometryType,
      inSR,
      outSR,
    });
    const geojsonGeoProj = arcgisGeoProj.map(geo => arcgis.parse(geo));
    return { geometries: geojsonGeoProj as any };
  }
  async project(
    params: ProjectGeometryParams,
  ): Promise<{ geometries: Geometry[] }> {
    const { inSR, outSR, geometries, geometryType } = params;
    if (geometries.length === 0) {
      return { geometries: [] };
    }
    const data = encodeFormData({
      inSR: inSR || this.options.srs,
      outSR: outSR || this.options.srs,
      geometries: {
        geometryType: 'esri' + geometryType,
        geometries,
      },
      f: 'json',
    });

    const url =
      this.options.arcService +
      '/rest/services/Utilities/Geometry/GeometryServer/project';
    const response = await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });
    return response.json();
  }
}

export const encodeFormData = data => {
  return Object.keys(data)
    .map(key => {
      let value = data[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&');
};
