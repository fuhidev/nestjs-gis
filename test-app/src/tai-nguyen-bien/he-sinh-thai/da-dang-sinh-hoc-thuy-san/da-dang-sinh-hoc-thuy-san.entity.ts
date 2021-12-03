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
import { DMPhanLoaiDDSH } from './danh-muc/dm-phan-loai-da-dang-sinh-hoc/dm-phan-loai-da-dang-sinh-hoc.entity';

@Entity('DADANGSINHHOCTHUYSAN', { synchronize: false })
export class DaDangSinhHocThuySanEntity {
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
    name: 'SoLuongThucVat',
    nullable: true,
    alias: 'Số lượng thực vật',
    type: 'int',
  })
  soLuongThucVat: number;

  @Column({
    name: 'SoLuongDongVat',
    nullable: true,
    alias: 'Số lượng động vật',
    type: 'int',
  })
  soLuongDongVat: number;

  @Column({
    name: 'SoLuongThucVatQuyHiem',
    nullable: true,
    alias: 'Số lượng thực vật quý hiếm',
    type: 'int',
  })
  soLuongThucVatQuyHiem: number;

  @Column({
    name: 'SoLuongDongVatQuyHiem',
    nullable: true,
    alias: 'Số lượng động vật quý hiếm',
    type: 'int',
  })
  soLuongDongVatQuyHiem: number;

  @Column({
    name: 'PhanLoaiDaDangSinhHoc',
    nullable: true,
    alias: 'Phân loại đa dang sinh học',
  })
  maLoai: string;
  @JoinColumn({ name: 'PhanLoaiDaDangSinhHoc' })
  @ManyToOne(() => DMPhanLoaiDDSH, {
    onDelete: 'CASCADE',
  })
  loai: DMPhanLoaiDDSH;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
