import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SINHTHAIBIENDAMPHA', { synchronize: false })
export class SinhThaiBienDamPhaEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'MoTaChung',
    nullable: true,
    alias: 'Mô tả chung',
  })
  moTaChung: string;

  @Column({
    name: 'TenLoaiDacHuu',
    nullable: true,
    alias: 'Tên loại đặc hữuu',
    isDisplayColumn: true,
  })
  tenLoaiDacHuu: string;

  @Column({
    name: 'SoLuong',
    nullable: true,
    alias: 'Số lượng',
    type: 'int',
  })
  soLuong: number;

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
