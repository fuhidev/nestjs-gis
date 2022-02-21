import { Controller, Module, UseGuards } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArcgisProxyModule,
  GeometryModule,
  GISTypeOrmCrudService,
  systemEntities,
  SystemManagerModule,
  DynamicRestModule,
  geometryTransformer,
  GeometryTypeEnum,
  JwtAuthGuard,
} from 'nestjs-gis';
import { TaiNguyenBienModule } from '@tai-nguyen-bien/tai-nguyen-bien.module';
import {
  Entity,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      options: { encrypt: false },
      keepConnectionAlive: true,
      type: 'mssql',
      host: '171.244.32.245',
      port: 1433,
      username: 'sa',
      password: 'Ditagis123',
      database: 'NinhThuan_TaiNguyenBien',
      synchronize: false,
      logging: false,
      entities: ['dist/**/*.entity{.ts,.js}', ...systemEntities],
    }),
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
    //   arcUrl: 'http://171.244.32.245/arcgis',
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
      connection: 'gis',
      jwt: {
        secret: 'hieu ',
      },
    }),
    DynamicRestModule.forRoot({
      dbConfig: {
        options: { encrypt: false },
        // keepConnectionAlive: true,
        name:'sdoc',
        type: 'mssql',
        host: '171.244.32.245',
        port: 1433,
        username: 'sa',
        password: 'Ditagis123',
        database: 'SDoc_NinhThuan',
        synchronize: false,
      },
      restEntities:[
        {
          path: 'rest/sdoc/file-group',
          tableName: 'FileGroup',
          columns: [
            {  type: 'smallint', propertyName: 'id' ,primary:true},
            {  type: 'nvarchar', propertyName: 'groupName' },
          ],
        },
      ]
    }),
    DynamicRestModule.forRoot({
      dbConfig: {
        options: { encrypt: false },
        // keepConnectionAlive: true,
        name:'restmodule',
        type: 'mssql',
        host: '171.244.32.245',
        port: 1433,
        username: 'sa',
        password: 'Ditagis123',
        database: 'NinhThuan_TaiNguyenBien',
        synchronize: false,
      },
      restEntities: [
        {
          path: 'rest/dm-loai-cang',
          tableName: 'CangBien_DM_Loai',
          columns: [
            {
              propertyName: 'code',
              type: 'nvarchar',
              primary: true,
              alias: 'Mã',
            },
            {
              propertyName: 'value',
              type: 'nvarchar',
              isDisplayColumn: true,
              alias: 'Giá trị',
            },
          ],
        },
        {
          path: 'rest/cang-bien',
          tableName: 'CangBien',
          columns: [
            { propertyName: 'objectId', type: 'int', primary: true },
            {
              propertyName: 'ten',
              type: 'nvarchar',
              isDisplayColumn: true,
              alias: 'Tên',
            },
            {
              propertyName: 'maLoai',
              type: 'nvarchar',
              name: 'Loai',
              alias: 'Loại cảng biển',
            },
            {
              propertyName: 'loai',
              join: {
                type: 'many-to-one',
                target: 'CangBien_DM_Loai',
                joinColumn: {
                  name: 'Loai',
                },
              },
            },
            { propertyName: 'dienTich', type: 'decimal', alias: 'Diện tích' },
            { propertyName: 'congSuat', type: 'decimal', alias: 'Công suất' },
            { propertyName: 'moTa', type: 'nvarchar', alias: 'Mô tả' },
            {propertyName:'shape',spatialFeatureType:GeometryTypeEnum.Polygon,type:'geometry'}
          ],
        },
        {
          path: 'rest/dm-cap-di-tich',
          tableName: 'DiTich_DM_CapDiTich',
          columns: [
            {
              propertyName: 'code',
              name: 'Code',
              type: 'nvarchar',
              primary: true,
            },
            {
              propertyName: 'value',
              name: 'Value',
              type: 'nvarchar',
            },
          ],
        },
        {
          path: 'rest/di-tich',
          tableName: 'DITICH',
          decorators:[UseGuards(JwtAuthGuard)],
          // crudOptions:{
          //   routes:{
          //     getManyBase:{
          //       decorators:[UseGuards(JwtAuthGuard)]
          //     }
          //   }
          // },
          columns: [
            {
              propertyName: 'objectId',
              name: 'OBJECTID',
              type: 'int',
              primary: true,
            },
            {
              propertyName: 'maCap',
              name: 'CAP',
              type: 'varchar',
            },
            {
              propertyName: 'cap',
              join: {
                target: 'DiTich_DM_CapDiTich',
                joinColumn: {
                  name: 'CAP',
                },
                type: 'many-to-one',
              },
            },
            {
              propertyName: 'shape',
              name: 'SHAPE',
              type: 'geometry',
              spatialFeatureType: GeometryTypeEnum.Point,
            },
          ],
        },
        {
          path: 'rest/dam-pha-ven-bien',
          tableName: 'DAMPHAVENBIEN',
          columns: [
            {
              propertyName: 'objectId',
              name: 'OBJECTID',
              type: 'int',
              primary: true,
            },
            {
              propertyName: 'shape',
              name: 'SHAPE',
              type: 'geometry',
              spatialFeatureType: GeometryTypeEnum.Polygon,
            },
          ],
        },
      ],
    }),
    // DynamicRestModule.forRoot({
    //   dbConfig: {
    //     options: { encrypt: false },
    //     keepConnectionAlive: true,
    //     type: "mssql",
    //     host: "171.244.32.245",
    //     port: 1433,
    //     username: "sa",
    //     password: "Ditagis123",
    //     database: "TIWAGIS",
    //     synchronize: false,
    //   },
    //   restEntities: [
    //     {
    //       path: "rest/dong-ho-tong-chi-tiet",
    //       tableName: "DongHoTongChiTiet",
    //       crudOptions:{
    //         routes:{
    //           updateOneBase:{
    //             allowParamsOverride:true
    //           }
    //         }
    //       },
    //       columns: [
    //         { propertyName: "ID", type: "int", primary: true, generated: true },
    //         { propertyName: "IDMaDongHo", type: "varchar" },
    //         { propertyName: "ApLuc", type: "float" },
    //         { propertyName: "LuuLuong", type: "float" },
    //         { propertyName: "SanLuong", type: "bigint" },
    //         { propertyName: "NgayCapNhat", type: "datetime" },
    //         { propertyName: "NguoiCapNhat", type: "varchar" },
    //         { propertyName: "ThoiGian", type: "datetime" },
    //       ],
    //     },
    //   ],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
