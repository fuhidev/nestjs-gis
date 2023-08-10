import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('services/geometry/places')
export class PlacesController {
  constructor(private service: PlacesService) {}
  @Get('reverse')
  reverse(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.service.coordinatesToAddress({ lat, lng });
  }
  @Get('search')
  search(@Query() q) {
    return this.service.addressToCoordinates({ query: q });
  }

  @Get('findPointAddress')
  findPointAddress(@Query('q') q) {
    return this.service.findAddress({ address: q });
  }
}
