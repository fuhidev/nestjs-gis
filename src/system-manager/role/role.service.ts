import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RoleEntity } from './role.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository, In, Not } from 'typeorm';
import { LayerEntity } from '../layer/layer.entity';
import { RoleLayerService } from '../role-layer/role-layer.service';
import { RoleLayerEntity } from '../role-layer/role-layer.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<RoleEntity>{
    constructor(
        @InjectRepository(RoleEntity) repo,
        @InjectRepository(LayerEntity) private repoLayer: Repository<LayerEntity>,
        @InjectRepository(RoleLayerEntity) private repoRoleLayer: Repository<RoleLayerEntity>,
    ) {
        super(repo);
    }

    /**
     * Tạo quyền truy cập vào các lớp dữ liệu thuộc SYS_Layer thông qua datasetId
     * chỉ thêm những layerId chưa tồn tại trong role.layers
     */
    async syncLayers(params: {
        roleId: string,
        lstDatasetId: string[]
    }) {
        const { roleId, lstDatasetId } = params;
        if (!roleId) {
            throw new BadRequestException('Không xác định được roleId');
        }

        if (!lstDatasetId || (lstDatasetId && !lstDatasetId.length)) {
            throw new BadRequestException('Không xác định được danh sách datasetId');
        }
        // const roleEntity = await  this.repo.findOne(roleId, { select: ['layers'] });
        const builder = this.repoLayer
            .createQueryBuilder('sl')
            .where({ datasetId: In(lstDatasetId) })
            .andWhere(`not exists (select * from ${this.repoRoleLayer.metadata.tableName} srl where srl.LayerId=sl.LayerId and srl.RoleId=:roleId)`,
                { roleId })
            .select('layerId');

        const layers: LayerEntity[] = await builder.execute();
        if (layers.length) {
            return this.repoRoleLayer.save(
                layers.map
                    (layer => ({ roleId, layerId: layer.layerId })),
                { chunk: 50 }
            );
        } else {
            return [];
        }
    }
}
