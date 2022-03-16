import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CrudRequestInterceptor } from '@nestjsx/crud';
import { PARSED_CRUD_REQUEST_KEY } from '@nestjsx/crud/lib/constants';
import { GISCrudRequest } from 'src/geometry';
import { moduleOptions } from '../token';

@Injectable()
export class GISCrudRequestInterceptor extends CrudRequestInterceptor
  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = super.intercept(context, next);
    const request = context.switchToHttp().getRequest();
    const value = request[PARSED_CRUD_REQUEST_KEY] as GISCrudRequest;
    if (value) {
      try {
        value.parsed.bbox = request.query.bbox
          ? JSON.parse(request.query.bbox)
          : null;
      } catch (error) {
        value.parsed.bbox = null;
      }
      try {
        value.parsed.outSR = request.query.outSR
          ? JSON.parse(request.query.outSR)
          : moduleOptions.srs;
      } catch (error) {
        value.parsed.outSR = moduleOptions.srs;
      }
      try {
        value.parsed.inSR = request.query.inSR
          ? JSON.parse(request.query.inSR)
          : 4326;
      } catch (error) {
        value.parsed.inSR = 4326;
      }
      value.parsed.fGeo = request.query.fGeo || 'esri';
      value.parsed.filterGeo = request.body.filterGeo || null;
    }
    return response;
  }
}
