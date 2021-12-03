import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { type } from 'os';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiCangEntity } from './danh-muc/dm-loai-cang/dm-loai-cang.entity';

@Entity('CANGBIEN', { synchronize: false })
export class CangBienEntity {
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
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'numeric',
  })
  dienTich: number;

  @Column({
    name: 'loai',
    nullable: true,
    alias: 'Loại',
  })
  maloai: string;
  @JoinColumn({ name: 'loai' })
  @ManyToOne(() => DMLoaiCangEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  loai: DMLoaiCangEntity;

  @Column({
    name: 'CongSuat',
    nullable: true,
    alias: 'Công suất',
    type: 'float',
  })
  congSuat: number;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
    length: '4000',
  })
  moTa: string;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
