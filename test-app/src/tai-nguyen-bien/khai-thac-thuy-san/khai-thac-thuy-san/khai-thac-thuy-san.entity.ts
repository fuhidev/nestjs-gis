import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { DMGiaiDoanEntity } from '@tai-nguyen-bien/danh-muc/dm-phan-loai/dm-phan-loai.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMKhaiThacThuySanEntity } from './danh-muc/dm-khai-thac-thuy-san/dm-khai-thac-thuy-san.entity';
import { Polygon } from 'terraformer-arcgis-parser';

@Entity('HIENTRANGKHAITHAC_THUYSAN', { synchronize: false })
export class HienTrangKhaiThacThuySanEntity {
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
    name: 'DoiTuong',
    nullable: true,
    alias: 'Đối tượng',
  })
  maDoiTuong: string;
  @JoinColumn({ name: 'DoiTuong' })
  @ManyToOne(() => DMKhaiThacThuySanEntity, {
    onDelete: 'CASCADE',
  })
  doiTuong: DMKhaiThacThuySanEntity;

  @Column({
    name: 'GiaiDoan',
    nullable: true,
    alias: 'aliasName',
    type: 'int',
    default: 0,
  })
  maGiaiDoan: number;
  @JoinColumn({ name: 'GiaiDoan' })
  @ManyToOne(() => DMGiaiDoanEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  giaiDoan: DMGiaiDoanEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
