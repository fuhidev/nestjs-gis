import * as wkt from 'terraformer-wkt-parser';
import * as arcgis from 'terraformer-arcgis-parser';
import { SpatialReferenceBase } from '../project-geometry/project-geometry.service';

export const geometryTransformer = {
  from: dbValue => {
    if(dbValue){
    const geometry =  arcgis.convert(wkt.parse(dbValue));
    geometry.spatialReference = SpatialReferenceBase;
    return geometry;
    }
    return null
  },
  to: (shape:arcgis.Geometry) => shape && wkt.convert(arcgis.parse(shape))
};
