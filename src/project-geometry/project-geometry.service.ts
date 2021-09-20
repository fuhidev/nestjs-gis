import { Injectable } from '@nestjs/common';
import { Geometry, SpatialReferenceWkt } from 'terraformer-arcgis-parser';
import fetch from 'node-fetch';
import {
  ProjectGeometryGeojsonParams,
  ProjectGeometryParams,
} from './project-geometry.interface';
import * as arcgis from 'terraformer-arcgis-parser';
import { GeometryObject } from 'geojson';
import { GeometryTypeEnum } from '../arcgis/interfaces/arcgis-geometry.interface';
const URL =
  'http://171.244.32.245:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer';
export const SpatialReferenceBase = {
  wkt: `PROJCS["BINHDUONG_VN2000",GEOGCS["GCS_VN_2000",DATUM["D_Vietnam_2000",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",105.75],PARAMETER["Scale_Factor",0.9999],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]`,
} as SpatialReferenceWkt;
@Injectable()
export class ProjectGeometryService {
  async projectGeojson(
    params: ProjectGeometryGeojsonParams
  ): Promise<{ geometries: GeometryObject[] }> {
    // chuyển cấu trúc geometry geojson > arcgis
    const { inSR, outSR, geometries } = params;
    const firstGeo = geometries[0];
    const geometryType =
      firstGeo.type === 'Point'
        ? GeometryTypeEnum.Point
        : firstGeo.type === 'LineString'
        ? GeometryTypeEnum.Polyline
        : firstGeo.type === 'Polygon'
        ? GeometryTypeEnum.Polygon
        : null;
    const arcgisGeometries = geometries.map((geo) => arcgis.convert(geo));
    const { geometries: arcgisGeoProj } = await this.project({
      geometries: arcgisGeometries,
      geometryType,
      inSR,
      outSR,
    });
    const geojsonGeoProj = arcgisGeoProj.map((geo) => arcgis.parse(geo));
    return { geometries: geojsonGeoProj as any };
  }
  async project(
    params: ProjectGeometryParams
  ): Promise<{ geometries: Geometry[] }> {
    const { inSR, outSR, geometries, geometryType } = params;
    if (geometries.length === 0) {
      return { geometries: [] };
    }
    const data = encodeFormData({
      inSR: inSR || SpatialReferenceBase,
      outSR: outSR || SpatialReferenceBase,
      geometries: {
        geometryType,
        geometries,
      },
      f: 'json',
    });

    const url = URL + '/project';
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

export const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => {
      let value = data[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&');
};
