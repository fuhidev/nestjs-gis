import { GISCrudRoutesFactory } from './crud-routes.factory';

export const GISCrud = () => (target: Object) => {
  let factory = new GISCrudRoutesFactory(target).create();
  factory = undefined;
};
