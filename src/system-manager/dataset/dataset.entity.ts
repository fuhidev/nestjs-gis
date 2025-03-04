import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { LayerEntity } from '../layer/layer.entity';

@Entity({
  name: 'SYS_Dataset',
})
export class DatasetEntity {
  @PrimaryColumn({
    name: 'DatasetId',
    type: 'varchar',
  })
  datasetId: string;

  @Column({ name: 'DatasetName', type: 'nvarchar' })
  datasetName: string;

  @Column({ name: 'STT', type: 'int', default: 0 }) stt: number;

  @OneToMany(() => LayerEntity, a => a.dataset)
  layers: LayerEntity[];
}
