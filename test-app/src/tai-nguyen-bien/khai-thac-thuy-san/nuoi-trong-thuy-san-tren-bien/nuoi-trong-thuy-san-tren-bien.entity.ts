import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NUOITRONGTHUYSANTRENBIEN', { synchronize: false })
export class NuoiTrongThuySanTrenBienEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

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
    name: 'QuyMo',
    nullable: true,
    alias: 'Quy mô',
    length: 1000,
  })
  quyMo: string;

  @Column({
    name: 'DienTich',
    nullable: true,
    alias: 'Diện tích',
    type: 'decimal',
  })
  dienTich: number;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
  })
  moTa: string;
}
