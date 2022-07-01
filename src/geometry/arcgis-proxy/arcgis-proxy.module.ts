import { Controller, DynamicModule, Module } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { AuthModule } from '../../system-manager';
import { ArcgisJWTAuthGuard } from './arcgis-jwt-auth.guard';
import { ArcgisProxyOptions, setOptions } from './arcgis-proxy-token';
import { ArcgisProxyController } from './arcgis-proxy.controller';
import { ArcgisProxyService } from './arcgis-proxy.service';

@Module({})
export class ArcgisProxyModule {
  static forRoot(options: ArcgisProxyOptions): DynamicModule {
    const paths: string[] = Reflect.hasMetadata(
      PATH_METADATA,
      ArcgisProxyController,
    )
      ? Reflect.getMetadata(PATH_METADATA, ArcgisProxyController)
      : [];
    paths.push(options.route + '/rest');
    Controller(paths)(ArcgisProxyController);
    setOptions(options);
    return {
      module: ArcgisProxyModule,
      imports: [AuthModule],
      controllers: [ArcgisProxyController],
      providers: [ArcgisProxyService, ArcgisJWTAuthGuard],
    };
  }
}
