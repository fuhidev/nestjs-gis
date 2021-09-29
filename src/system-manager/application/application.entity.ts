import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BeforeUpdate } from "typeorm";
import { ApplicationGroupEntity } from "../application-group/application-group.entity";

@Entity({
    name: 'SYS_Application',
})
export class ApplicationEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'ApplicationId' })
    applicationId: string;

    @Column({ name: 'ApplicationName', type: 'nvarchar' })
    applicationName: string;

    @Column({ name: 'IsEnabled', nullable: true, default: false })
    isEnabled: boolean;

    @Column({ name: 'ApplicationGroupId', type: 'uuid', nullable: true })
    applicationGroupId: string;

    @JoinColumn({ name: 'ApplicationGroupId' })
    @ManyToOne(() => ApplicationGroupEntity, c => c.applicationGroupId)
    applicationGroup: ApplicationGroupEntity;

    @Column({ name: 'EnvironmentId', type: 'varchar', nullable: false, default: 'W' })
    environmentId: string;

    @Column({ name: 'Config', type: 'nvarchar', length: 'MAX', nullable: true, default: '{}' })
    config: string;

    @BeforeUpdate()
    stringifyConfig() {
        if (this.config && typeof this.config === 'object') {
            this.config = JSON.stringify(this.config);
        }
    }
}