import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserStatusEntity } from './user-status/user-status.entity';
import { UserStatusEnum } from './user.constant';
import { RoleEntity } from '../role/role.entity';
import { CrudValidationGroups, Crud } from '@nestjsx/crud';
import { hash } from '../auth.util';
@Entity({
  name: 'SYS_User',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'UserId'
  })
  userId: string;

  @Column({ unique: true, length: 100, type: 'varchar', name: 'Username', nullable: false })
  username: string;

  @Column({ length: 255, type: 'varchar', name: 'Password', nullable: false })
  password: string;
  @Column({ length: 255, type: 'nvarchar', name: 'DisplayName', nullable: true })

  displayName: string;

  @Column({ name: 'Status', type: 'varchar', nullable: true, default: UserStatusEnum.Request })
  statusId: string;

  @JoinColumn({ name: 'Status' })
  @ManyToOne(() => UserStatusEntity, a => a.id, { cascade: ['insert'] })
  status: UserStatusEntity;

  @Column({ name: 'LockDate', nullable: true })
  lockDate: Date;

  @CreateDateColumn({ name: 'CreateDate' })
  createDate: Date;

  @UpdateDateColumn({ name: 'UpdateDate' })
  updateDate: Date;

  @Column({ name: 'Avatar', type: 'nvarchar', nullable: true })
  avatar: string;

  @Column({ name: 'RoleId', nullable: false, type: 'uuid' })
  roleId: string;

  @JoinColumn({ name: 'RoleId' })
  @ManyToOne(() => RoleEntity, r => r.roleId)
  role: RoleEntity;

  @BeforeUpdate()
  updatelockDate() {
    if (this.statusId === UserStatusEnum.Locked
      || (this.status && this.status.id === UserStatusEnum.Locked)) {
      this.lockDate = new Date();
    }
  }

  @BeforeInsert()
  updatePassword() {
    this.password = hash(this.password);
  }
}