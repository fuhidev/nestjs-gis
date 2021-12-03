import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QUYHOACHPHATTRIENDULICH', { synchronize: false })
export class QuyHoachPhatTrienDuLichEntity {
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
    name: 'ViTri',
    nullable: true,
    alias: 'Vị trí',
  })
  viTri: string;

  @Column({
    name: 'DongLuc',
    nullable: true,
    alias: 'Động lực',
  })
  dongLuc: string;

  @Column({
    name: 'DiemDuLich',
    nullable: true,
    alias: 'Điểm du lịch',
  })
  diemDuLich: string;

  @Column({
    name: 'SanPhamDuLich',
    nullable: true,
    alias: 'Sản phẩm du lịch',
  })
  sanPhamDuLich: string;

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
