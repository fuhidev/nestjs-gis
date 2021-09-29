import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DatasetEntity } from './dataset.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, DeepPartial } from 'typeorm';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud/lib/interfaces';
import { getDatabaseName } from '../../utils/database.util';

@Injectable()
export class DatasetService extends TypeOrmCrudService<DatasetEntity> {
    constructor(
        @InjectRepository(DatasetEntity) repo,
        @InjectEntityManager() private entityManager: EntityManager
    ) {
        super(repo);
    }


    /**
     * lấy dữ liệu feature dataset từ gdb_items
     */
    async getDataGDB(req: CrudRequest): Promise<DatasetEntity[]> {
        const { options, parsed } = req;
        const databaseName: string = (await this.entityManager.query(`select top 1 databaseName = database_name+'.'+owner+'.' from SDE_table_registry`))[0].databaseName;
        const builder = this.createBuilderGDB();
        if (parsed && parsed.filter.some(s => s.field === 'notExist')) {
            const fi = parsed.filter.find(f => f.field === 'notExist');
            if (fi && fi.value) {
                builder
                    .andWhere(`not exists (select datasetId 
                    from ${this.repo.metadata.tableName}
                    where '${databaseName}'+datasetId = a.Name
                    )`);
            }
        }
        const sort = this.getSort(parsed, options.query);
        builder.orderBy(sort);
        const take = this.getTake(parsed, options.query);
        if (isFinite(take)) {
            builder.take(take);
        }
        const skip = this.getSkip(parsed, take);
        if (isFinite(skip)) {
            builder.skip(skip);
        }

        const data: DatasetEntity[] = await builder.execute();

        //    const data = await this.doGetMany(builder, parsed, options)

        // for (const d of data) {
        //     const regex = new RegExp(databaseName, 'ig');
        //     d.datasetId = d.datasetId.replace(regex, '');
        //     d.datasetName = d.datasetId;
        // }

        return data as any;
    }

    private createBuilderGDB() {
        const builder = this.entityManager.createQueryBuilder();
        builder
            .from('GDB_ITEMS', 'a')
            .innerJoinAndSelect('GDB_ITEMTYPES', 'b', ' a.Type=b.UUID')
            .where(`b.Name='Feature Dataset'`)
            .select('a.Name', 'datasetId')
            .addSelect(`a.Definition.value('(/DEFeatureDataset/Name)[1]','nvarchar(255)')`, 'datasetName');
        return builder;
    }

    async updateAlias(datasetId: string, alias: string) {
        // lấy dữ liệu
        // tìm đoạn name để replace
        const builder = this.entityManager.createQueryBuilder();
        builder
            .from('GDB_ITEMS', 'a')
            .innerJoinAndSelect('GDB_ITEMTYPES', 'b', ' a.Type=b.UUID')
            .where(`b.Name='Feature Dataset'`)
            .andWhere(`a.Name like :name`, { name: '%' + datasetId })
            .select('a.UUID', 'id')

        const [entity] = await builder.execute();
        if (entity) {
            const sql = `
            UPDATE GDB_ITEMS
            SET Definition.modify(N'  
                  replace value of(/DEFeatureDataset/Name/text())[1]  
                  with "${alias}" ') 
            where  UUID = @0
            `;
            await this.entityManager.query(sql, [entity.id, alias]);
            return true;
        }
        return false;
    }

    async createMany(req: CrudRequest, dto: CreateManyDto<DeepPartial<DatasetEntity>>) {
        const dbName = await getDatabaseName(this.entityManager);
        if (dto.bulk.length) {
            dto.bulk.forEach(d => {
                const regex = new RegExp(dbName, 'ig');
                d.datasetId = d.datasetId.replace(regex, '');
            });
        }
        return super.createMany(req, dto);
    }

    async updateAliasNameFromGDB(params: {
        lstDatasetId: string[]
    }) {
        const dbName = await getDatabaseName(this.entityManager);
        const { lstDatasetId } = params;
        if (lstDatasetId.length === 0) {
            throw new BadRequestException('Chưa truyền danh sách datasetId')
        }
        const builder = this.createBuilderGDB();
        builder.andWhere(`a.Name in (${lstDatasetId.map(m => `'${dbName}${m}'`).join(',')})`);

        const gdb = await builder.execute() as DatasetEntity[];

        const entities: DatasetEntity[] = gdb.map(m => {
            const regex = new RegExp(dbName, 'ig');
            return this.repo.create({
                datasetId: m.datasetId.replace(regex, ''),
                datasetName: m.datasetName
            })
        });
        return this.repo.save(entities, { chunk: 50 });
    }
}
