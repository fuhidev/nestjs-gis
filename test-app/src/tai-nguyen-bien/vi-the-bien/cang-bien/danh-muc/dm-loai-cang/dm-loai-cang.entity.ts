import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CangBien_DM_Loai')
export class DMLoaiCangEntity {
    @PrimaryColumn({ name: 'Code'}) code: string;
  @Column({
    name: 'Value',
    nullable: true,
  })
  value: string;
}
