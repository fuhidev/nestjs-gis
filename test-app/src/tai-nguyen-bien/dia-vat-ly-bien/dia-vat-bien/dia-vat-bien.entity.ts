import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { type } from 'os';
import { DMLoaiThuyQuyenEntity } from 'src/tai-nguyen-bien/danh-muc/dm-loai-thuy-quyen/dm-loai-thuy-quyen.entity';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiThachQuyenEntity } from '../../danh-muc/dm-loai-thach-quyen/dm-loai-thach-quyen.entity';
@Entity('DIAVATBIEN', { synchronize: false })
export class DiaVatBienEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'numeric',
  })
  dienTich: number;

  @Column({
    name: 'TruLuong',
    nullable: true,
    alias: 'Trữ lượng',
    type: 'numeric',
  })
  truLuong: number;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
  })
  moTa: string;

  @Column({
    name: 'LoaiThuyQuyen',
    nullable: true,
    alias: 'Loại thuỷ quyển',
  })
  maLoaiThuyQuyen: number;
  @JoinColumn({ name: 'LoaiThuyQuyen' })
  @ManyToOne(() => DMLoaiThuyQuyenEntity, {
    onDelete: 'CASCADE',
  })
  loaiThuyQuyen: DMLoaiThuyQuyenEntity;

  @Column({
    name: 'LoaiThachQuyen',
    nullable: true,
    alias: 'Loại thạch quyển',
  })
  maLoaiThachQuyen: number;
  @JoinColumn({ name: 'LoaiThachQuyen' })
  @ManyToOne(() => DMLoaiThachQuyenEntity, {
    onDelete: 'CASCADE',
  })
  loaiThachQuyen: DMLoaiThachQuyenEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
