import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { type } from 'os';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PHANBOTRAMTICH', { synchronize: false })
export class PhanBoTramTichEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'LoaiTramTich',
    nullable: true,
    alias: 'Loại trầm tích',
  })
  loaiTramTich: string;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'float',
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
