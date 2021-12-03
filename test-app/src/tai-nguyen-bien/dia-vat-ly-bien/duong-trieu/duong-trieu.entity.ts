import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiDuongTrieuEntity } from './danh-muc/dm-loai-duong-trieu/dm-loai-duong-trieu.entity';

@Entity('DUONGTRIEU', { synchronize: false })
export class DuongTrieuEntity {
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
    name: 'LoaiDuongTrieu',
    nullable: true,
    alias: 'Loại đường triều',
  })
  maLoaiDuongTrieu: number;
  @JoinColumn({ name: 'LoaiDuongTrieu' })
  @ManyToOne(() => DMLoaiDuongTrieuEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  loaiDuongTrieu: DMLoaiDuongTrieuEntity;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
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
