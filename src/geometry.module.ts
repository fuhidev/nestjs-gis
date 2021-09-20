import { Module } from '@nestjs/common';
import { GeometryService } from './geometry.service';
import { PlacesModule } from './places/places.module';
import { ProjectGeometryModule } from './project-geometry/project-geometry.module';

@Module({
  imports: [ProjectGeometryModule, PlacesModule],
  providers: [GeometryService],
  exports: [GeometryService],
})
export class GeometryModule {}
