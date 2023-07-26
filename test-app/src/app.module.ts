import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GeometryModule,
  systemEntities,
  SystemManagerModule,
} from 'nestjs-gis';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CayXanhModule } from './cay-xanh/cay-xanh.module';

const dbConfig: SqlServerConnectionOptions = {
  options: { encrypt: false },
  type: 'mssql',
  host: 'ditagis.com',
  port: 1433,
  username: 'sa',
  password: 'Ditagis123',
  database: 'BinhThuanGIS',
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}', ...systemEntities],
};

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    // TaiNguyenBienModule,
    GeometryModule.forRoot({
      srs: {
        wkt: `PROJCS["TPHCM_VN2000",GEOGCS["GCS_VN_2000",DATUM["D_Vietnam_2000",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",105.75],PARAMETER["Scale_Factor",0.9999],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]`,
      },
      arcService: 'http://171.244.32.245/arcgis',
      // hook: {
      // crudService: function(name) {
      //   if (name === 'getOne') {
      //     arguments[1][0].ma = 'hieu dep trai';
      //   }
      //   return 'hieu dep trai';
      // },
      // },
    }),
    // ArcgisProxyModule.forRoot({
    //   arcUrl: 'http://ditagis.com/arcgis',
    //   route: 'arcgis',
    //   user: {
    //     username: 'backendproxy',
    //     password: 'backendproxy@123',
    //   },
    // }),
    // ArcgisProxyModule.forRoot({
    //   arcUrl: 'http://ditagis.com/arcgis',
    //   route: 'ditagis',
    // }),
    SystemManagerModule.forRoot({
      jwt: {
        secret: 'hieu ',
      },
      host: 'http://localhost:3000',
    }),
    CayXanhModule,
    // DynamicRestModule.fromSys({
    //   dbConfig: { ...dbConfig, name: 'fromsys' },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
