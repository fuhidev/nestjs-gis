import {
  Column,
  geometryTransformer,
  GeometryTypeEnum,
  Point,
} from 'nestjs-gis';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('BAITAM', { synchronize: false })
export class BaiTamEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'Ten',
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
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Point,
  })
  shape: Point;
}
