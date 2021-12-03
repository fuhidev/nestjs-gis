import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { DMTinhTrangKhaiThacEntity } from 'src/tai-nguyen-bien/danh-muc/dm-tinh-trang-khai-thac/dm-tinh-trang-khai-thac.entity';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('DAUKHIBIEN', { synchronize: false })
export class DauKhiBienEntity {
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
  tenKhoangSan: string;

  @Column({
    name: 'ViTri',
    nullable: true,
    alias: 'Vị trí',
  })
  viTri: string;

  @Column({
    name: 'DoSau',
    nullable: true,
    alias: 'Độ sâu',
    type: 'float',
  })
  doSau: number;

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
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}
