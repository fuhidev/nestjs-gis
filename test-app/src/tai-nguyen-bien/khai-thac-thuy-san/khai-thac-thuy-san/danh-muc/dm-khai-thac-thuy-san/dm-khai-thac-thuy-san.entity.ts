import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('KhaiThac_ThuySan_DM_LoaiThuySan')
export class DMKhaiThacThuySanEntity {
    @PrimaryColumn({ name: 'Code' }) code: string;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',isDisplayColumn: true,
    })
    value: string;
}
