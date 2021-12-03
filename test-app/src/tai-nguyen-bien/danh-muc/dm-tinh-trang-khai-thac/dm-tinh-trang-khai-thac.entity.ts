import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DM_TinhTrangKhaiThac')
export class DMTinhTrangKhaiThacEntity {
    @PrimaryColumn({ name: 'Code', type: 'int' }) code: number;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',isDisplayColumn: true,
    })
    value: string;
}
