import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeometryModule } from 'nestjs-gis';

@Module({
  imports: [
    // CayXanhModule,
    TypeOrmModule.forRoot({
      options: { encrypt: false },
      type: 'mssql',
      host: '171.244.32.245',
      port: 1433,
      username: 'sa',
      password: 'Ditagis123',
      database: 'KhuCongNgheCao',
      synchronize: false,
      logging: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      subscribers: [__dirname + '/../../**/*.subscriber{.ts,.js}'],
    }),
    GeometryModule.forRoot({
      srs:{wkid:4326},arcService:'http://171.244.32.245/arcgis'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
