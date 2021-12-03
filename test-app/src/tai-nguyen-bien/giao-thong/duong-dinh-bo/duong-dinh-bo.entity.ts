import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DUONGDINHBO', { synchronize: false })
export class DuongDinhBoEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'Loai',
    nullable: true,
    alias: 'Loại',
  })
  loai: string;

  @Column({
    name: 'DoSau',
    nullable: true,
    alias: 'Độ sâu',
    type: 'numeric',
  })
  doSau: number;

  @Column({
    name: 'ChieuDai',
    nullable: true,
    alias: 'Chiều dài',
    type: 'numeric',
  })
  chieuDai: number;
}
