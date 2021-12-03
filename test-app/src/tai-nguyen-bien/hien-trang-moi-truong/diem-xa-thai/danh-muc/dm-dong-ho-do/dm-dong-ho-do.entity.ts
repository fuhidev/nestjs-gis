import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DiemXaThai_DM_DongHoDo')
export class DMDongHoDoEntity {
    @PrimaryColumn({ name: 'Code', type: 'int' }) code: number;
    @Column({
      name: 'Value',
      nullable: true,
      alias: 'Giá trị',isDisplayColumn: true,
    })
    value: string;
}
