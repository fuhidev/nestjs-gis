import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiDamPhaEntity } from './danh-muc/dm-loai-dam-pha/dm-loai-dam-pha.entity';

@Entity('DAMPHAVENBIEN', { synchronize: false })
export class DamPhaVenBienEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'TenDamPha',
    nullable: true,
    alias: 'Tên',
    isDisplayColumn: true,
  })
  tenDamPha: string;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'decimal',
  })
  dienTich: number;

  @Column({
    name: 'loaiDamPha',
    nullable: true,
    alias: 'Loại đầm phá',
  })
  maloaiDamPha: string;
  @JoinColumn({ name: 'loaiDamPha' })
  @ManyToOne(() => DMLoaiDamPhaEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  loaiDamPha: DMLoaiDamPhaEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
