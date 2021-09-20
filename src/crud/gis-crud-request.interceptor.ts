import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { CrudRequestInterceptor } from '@nestjsx/crud';
import { PARSED_CRUD_REQUEST_KEY } from '@nestjsx/crud/lib/constants';

@Injectable()
export class GISCrudRequestInterceptor extends CrudRequestInterceptor
  implements NestInterceptor {
intercept(context: ExecutionContext, next: CallHandler){
  const response =  super.intercept(context,next);
  const request = context.switchToHttp().getRequest();
  const value = request[PARSED_CRUD_REQUEST_KEY]
  if(value){
    
    try {
      value.parsed.bbox = request.query.bbox ?
    JSON.parse(request.query.bbox):
    null;
    value.parsed.outSR = request.query.outSR ?
    JSON.parse(request.query.outSR):
    null;
    } catch (error) {
      
    }
    
    value.parsed.fGeo = request.query.fGeo || 'esri';
    value.parsed.filterGeo = request.body.filterGeo || null;
  }
  return response;
}
  }