import * as wkt from 'terraformer-wkt-parser';
import * as arcgis from 'terraformer-arcgis-parser';
import { SpatialReference } from '../arcgis/interfaces/spatial-reference';
import { moduleOptions } from '../token';

export const geometryTransformerSrs = (srs?: SpatialReference) => ({
  from: dbValue => {
    if (dbValue) {
      const geometry = arcgis.convert(wkt.parse(dbValue));
      if (srs) geometry.spatialReference = srs;
      return geometry;
    }
    return null;
  },
  to: (shape: arcgis.Geometry) => shape && wkt.convert(arcgis.parse(shape)),
});
export const geometryTransformer = {
  from: dbValue => {
    if (dbValue) {
      const geometry = arcgis.convert(wkt.parse(dbValue));
      if (moduleOptions) geometry.spatialReference = moduleOptions.srs;
      return geometry;
    }
    return null;
  },
  to: (shape: arcgis.Geometry) => shape && wkt.convert(arcgis.parse(shape)),
};
