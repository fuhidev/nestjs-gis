import { Column } from 'nestjs-gis';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NhanChimBienEntity } from '../nhan-chim-bien.entity';
import { DMVatChatNhanChimEntity } from './danh-muc/dm-vat-chat-nhan-chim/dm-vat-chat-nhan-chim.entity';

@Entity('NhanChimBien_VatChat')
export class NhanChimBienVatChatEntity {
  @PrimaryGeneratedColumn({ name: 'Ma' }) ma: number;

  @Column({
    name: 'Ten',
    nullable: true,
    alias: 'Tên',
  })
  maTen: number;
  @JoinColumn({ name: 'Ten' })
  @ManyToOne(() => DMVatChatNhanChimEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ten: DMVatChatNhanChimEntity;

  @Column({
    name: 'SoLuong',
    nullable: true,
    alias: 'Số lượng',
  })
  soLuong: number;

  @Column({
    name: 'DonVi',
    nullable: true,
    alias: 'Đơn vị',
  })
  donVi: string;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
  })
  moTa: string;

  @Column({
    name: 'NhanChimBien',
    nullable: true,
    alias: 'Nhận chìm biển',
  })
  maNhanChimBien: string;
  @JoinColumn({ name: 'NhanChimBien' })
  @ManyToOne(() => NhanChimBienEntity, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  nhanChimBien: NhanChimBienEntity;
}
