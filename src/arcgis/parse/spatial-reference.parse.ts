import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { SpatialReference } from '../interfaces/spatial-reference';

export class ParseSR implements PipeTransform{
  transform(pValue: string, metadata: ArgumentMetadata) {
    if(pValue){
    const result =  new SpatialReference()
      const  value= JSON.parse(pValue);
      result.wkt  = value.wkt;
      result.wkid = value.wkid;
      return result;
    }
    return null;
  }

}