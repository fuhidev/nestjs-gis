import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { type } from 'os';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('HIENTRANGPHATTRIENDULICH', { synchronize: false })
export class HienTrangPhatTrienDuLichEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'Tên',
    nullable: true,
    alias: 'Tên',
    isDisplayColumn: true,
  })
  ten: string;

  @Column({
    name: 'Loai',
    nullable: true,
    alias: 'Loại',
  })
  loai: string;

  @Column({
    name: 'TiemNang',
    nullable: true,
    alias: 'Tiềm năng',
  })
  viTri: string;

  @Column({
    name: 'DongLuc',
    nullable: true,
    alias: 'Động lực',
  })
  dongLuc: string;

  @Column({
    name: 'ChuVi',
    nullable: true,
    alias: 'Chu vi',
    type: 'numeric',
  })
  chuVi: number;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'numeric',
  })
  dienTich: number;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
