import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DiTich_DM_CapDiTich')
export class DMCapDiTichEntity {
    @PrimaryColumn({ name: 'Code' }) code: string;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',isDisplayColumn: true,
    })
    value: string;
}
