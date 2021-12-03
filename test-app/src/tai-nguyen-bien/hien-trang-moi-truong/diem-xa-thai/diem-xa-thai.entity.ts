import {
  Column,
  geometryTransformer,
  GeometryTypeEnum,
  Point,
} from 'nestjs-gis';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMDongHoDoEntity } from './danh-muc/dm-dong-ho-do/dm-dong-ho-do.entity';

@Entity('DIEMXATHAI', { synchronize: false })
export class DiemXaThaiEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'TenCoSo',
    nullable: true,
    alias: 'Tên cơ sở',
    isDisplayColumn: true,
  })
  tenCoSo: string;

  @Column({
    name: 'DiaDiem',
    nullable: true,
    alias: 'Địa điểm',
  })
  diaDiem: string;

  @Column({
    name: 'CongTrinhDanNuocThai',
    nullable: true,
    alias: 'Công trình dẫn nước thải',
  })
  congTrinhDanNuocThai: string;

  @Column({
    name: 'ThuyVucTiepNhan',
    nullable: true,
    alias: 'Thủy vực tiếp nhận',
  })
  thuyVucTiepNhan: string;

  @Column({
    name: 'GiayPhep',
    nullable: true,
    alias: 'Giấy phép ',
  })
  giayPhep: string;

  @Column({
    name: 'DongHoDo',
    nullable: true,
    alias: 'aliasName',
  })
  maDongHoDo: string;
  @JoinColumn({ name: 'DongHoDo' })
  @ManyToOne(() => DMDongHoDoEntity, {
    onDelete: 'CASCADE',
  })
  dongHoDo: DMDongHoDoEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Point,
  })
  shape: Point;
}
