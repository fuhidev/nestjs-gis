import { SpatialReference } from './arcgis';

export interface GeometryModuleOptions {
  srs: SpatialReference;
  arcService?: string;
}

export const TOKEN = 'token';

export let moduleOptions :GeometryModuleOptions;

export function setOptions(options:GeometryModuleOptions){
  moduleOptions = options;
}