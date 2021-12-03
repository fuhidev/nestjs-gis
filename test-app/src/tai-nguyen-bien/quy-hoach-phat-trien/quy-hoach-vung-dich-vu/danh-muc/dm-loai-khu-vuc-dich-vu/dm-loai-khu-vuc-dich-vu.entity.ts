import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DMLoaiKhuVucDichVu')
export class DMLoaiKhuVucDichVuEntity {
    @PrimaryColumn({ name: 'Code'}) code: string;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',isDisplayColumn: true,
    })
    value: string;
}
