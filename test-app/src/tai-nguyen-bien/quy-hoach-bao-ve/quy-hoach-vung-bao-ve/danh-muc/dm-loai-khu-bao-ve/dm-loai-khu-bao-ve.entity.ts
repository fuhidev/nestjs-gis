import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QuyHoach_VungBaoVe_DM_LoaiKhu')
export class DmLoaiKhuBaoVeEntity {
    @PrimaryColumn({ name: 'Code' }) code: string;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',
    })
    value: string;
}
