import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeometryModule } from 'nestjs-gis';
import { CayXanhModule } from './cay-xanh/cay-xanh.module';
import { CayXanhEntity } from './cay-xanh/cay-xanh.entity';

@Module({
  imports: [
    CayXanhModule,
    TypeOrmModule.forRoot({
      options: { encrypt: false },
      keepConnectionAlive:true,
      type: 'mssql',
      host: '171.244.32.245',
      port: 1433,
      username: 'sa',
      password: 'Ditagis123',
      database: 'KhuCongNgheCao',
      synchronize: false,
      logging: false,
      entities: [CayXanhEntity],
    }),
    GeometryModule.forRoot({
      srs: { wkt:`PROJCS["TPHCM_VN2000",GEOGCS["GCS_VN_2000",DATUM["D_Vietnam_2000",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",105.75],PARAMETER["Scale_Factor",0.9999],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]` },
      arcService: 'http://171.244.32.245/arcgis',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
