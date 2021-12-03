import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { type } from 'os';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiKhoangSanEntity } from './danh-muc/dm-loai-khoang-san/dm-loai-khoang-san.entity';
import { DMGiaiDoanEntity } from '../../danh-muc/dm-phan-loai/dm-phan-loai.entity';
import { DMTinhTrangKhaiThacEntity } from '../../danh-muc/dm-tinh-trang-khai-thac/dm-tinh-trang-khai-thac.entity';
import { Polygon } from 'terraformer-arcgis-parser';

@Entity('KHOANGSANBIEN', { synchronize: false })
export class KhoangSanEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'TenKhoangSan',
    nullable: true,
    alias: 'Tên khoáng sản',
    isDisplayColumn: true,
  })
  tenKhoangSan: string;

  @Column({
    name: 'TruLuong',
    nullable: true,
    alias: 'Trữ lượng',
    type: 'float',
  })
  truLuong: number;

  @Column({
    name: 'LoaiKhoangSan',
    nullable: true,
    alias: 'Loại khoáng sản',
  })
  maLoaiKhoangSan: number;
  @JoinColumn({ name: 'LoaiKhoangSan' })
  @ManyToOne(() => DMLoaiKhoangSanEntity, {
    onDelete: 'CASCADE',
  })
  loaiKhoangSan: DMLoaiKhoangSanEntity;

  @Column({
    name: 'GiaiDoan',
    nullable: true,
    alias: 'Giai đoạn',
  })
  maGiaiDoan: number;
  @JoinColumn({ name: 'GiaiDoan' })
  @ManyToOne(() => DMGiaiDoanEntity, {
    onDelete: 'CASCADE',
  })
  giaiDoan: DMGiaiDoanEntity;

  @Column({
    name: 'TinhTrangKhaiThac',
    nullable: true,
    alias: 'Tình trạng khai thác',
  })
  maTinhTrangKhaiThac: number;
  @JoinColumn({ name: 'TinhTrangKhaiThac' })
  @ManyToOne(() => DMTinhTrangKhaiThacEntity, {
    onDelete: 'CASCADE',
  })
  tinhTrangKhaiThac: DMTinhTrangKhaiThacEntity;

  @Column({
    name: 'ViTri',
    nullable: true,
    alias: 'Vị trí',
  })
  viTri: string;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'decimal',
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
