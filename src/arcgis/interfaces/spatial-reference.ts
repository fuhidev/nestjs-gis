export class SpatialReference {
  wkid?: number;
  wkt?: string;
}

export function equalSrs(srs1?: number | SpatialReference, srs2?: number | SpatialReference) {
  if (typeof srs1 === 'number' && typeof srs2 === 'number') {
    return srs1 === srs2;
  } else if (typeof srs1 === 'object' && typeof srs2 === 'number') {
    srs1 = srs1 as SpatialReference;
    if (srs2 === srs1.wkid) {
      return true;
    }
  } else if (typeof srs2 === 'object' && typeof srs1 === 'number') {
    srs2 = srs2 as SpatialReference;
    if (srs1 === srs2.wkid) {
      return true;
    }
  } else if (typeof srs1 === 'object' && typeof srs2 === 'object') {
    srs1 = srs1 as SpatialReference;
    srs2 = srs2 as SpatialReference;
    if (srs1.wkid === srs2.wkid) {
      return true;
    }
    if (srs1.wkt === srs2.wkt) {
      return true;
    }
  }
  return false;
}