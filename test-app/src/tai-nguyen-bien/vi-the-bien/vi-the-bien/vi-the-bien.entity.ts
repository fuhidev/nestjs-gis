import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('VITHEBIEN', { synchronize: false })
export class ViTheBienEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'SoLuongHeThongThuyHe',
    nullable: true,
    alias: 'Số lượng hệ thống thuỷ hệ',
    type: 'int',
  })
  soLuongHeThongThuyHe: number;
  @Column({
    name: 'SoLuongHeSinhThai',
    nullable: true,
    alias: 'Số lượng hệ sinh thái',
    type: 'int',
  })
  soLuongHeSinhThai: number;
  @Column({
    name: 'SoLuongKhuVucSinhThai',
    nullable: true,
    alias: 'Số lượng khu vực sinh thái',
    type: 'int',
  })
  soLuongKhuVucSinhThai: number;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
