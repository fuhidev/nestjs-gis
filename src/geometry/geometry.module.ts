import { DynamicModule, Module } from '@nestjs/common';
import { GeometryModuleOptions, setOptions } from '../token';
import { GeometryController } from './geometry.controller';
import { GeometryService } from './geometry.service';
import { PlacesModule } from './places/places.module';
import { ProjectGeometryModule } from './project-geometry/project-geometry.module';

@Module({
  imports: [ProjectGeometryModule, PlacesModule],
  providers: [GeometryService],
  exports: [GeometryService],
  controllers: [GeometryController],
})
export class GeometryModule {
  static forRoot(options: GeometryModuleOptions): DynamicModule {
    setOptions({
      arcService: 'http://171.244.32.245:6080/arcgis',
      ...options,
    } as GeometryModuleOptions);
    return {
      module: GeometryModule,
    };
  }
}
