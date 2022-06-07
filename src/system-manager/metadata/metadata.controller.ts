import { Controller, Get } from '@nestjs/common';
import { version } from '../../../package.json';
@Controller('metadata')
export class MetadataController {
  @Get()
  getMetadata() {
    return {
      name: 'nestjs-gis',
      version,
    };
  }
}
