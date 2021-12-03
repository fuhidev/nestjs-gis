import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DamPhaVenBien_DM_Loai')
export class DMLoaiDamPhaEntity {
  @PrimaryColumn({ name: 'Code' }) code: string;
  @Column({
    name: 'Value',
    nullable: true,
  })
  value: string;
}
