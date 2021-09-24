import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProjectGeometryService } from './project-geometry/project-geometry.service';
import { GeometryService } from './geometry.service';
import { PlacesModule } from './places/places.module';
import { ProjectGeometryModule } from './project-geometry/project-geometry.module';
import { GeometryModuleOptions, setOptions, TOKEN } from './token';

@Module({
  imports: [ProjectGeometryModule, PlacesModule],
  providers: [GeometryService],
  exports: [GeometryService],
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
