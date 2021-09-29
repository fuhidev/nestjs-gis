import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatasetModule } from './dataset/dataset.module';
import { LayerModule } from './layer/layer.module';
import { ColumnModule } from './column/column.module';
import { CodedDomainModule } from './coded-domain/coded-domain.module';
import { ApplicationModule } from './application/application.module';
import { ApplicationGroupModule } from './application-group/application-group.module';
import { RoleModule } from './role/role.module';
import { LoggerModule } from './logger/logger.module';
import { DesktopModule } from './desktop/desktop.module';
import { RoleLayerModule } from './role-layer/role-layer.module';
import { AuthModule } from './auth/auth.module';
import { setOption, SystemManagerOptions } from './system-manager.token';
import { UserEntity, UserStatusEntity } from './user';
import { RoleEntity } from './role/role.entity';
import { RoleLayerEntity } from './role-layer/role-layer.entity';
import { LoggerEntity } from './logger/logger.entity';
import { LoggerActionTypeEntity } from './logger/logger-action-type.entity';
import { DatasetEntity } from './dataset/dataset.entity';
import { LayerEntity } from './layer/layer.entity';
import { ApplicationEntity } from './application';
import { ApplicationGroupEntity } from './application-group';
export const systemEntities = [
  UserEntity,
  UserStatusEntity,
  RoleEntity,
  RoleLayerEntity,
  LoggerEntity,
  LoggerActionTypeEntity,
  DatasetEntity,
  LayerEntity,
  ApplicationEntity,
  ApplicationGroupEntity,
];
@Module({})
export class SystemManagerModule {
  static forRoot(options?: SystemManagerOptions): DynamicModule {
    console.error(options)
    setOption(options);
    return {
      module: SystemManagerModule,
      imports: [
        UserModule,
        DatasetModule,
        LayerModule,
        ColumnModule,
        CodedDomainModule,
        ApplicationModule,
        ApplicationGroupModule,
        RoleModule,
        LoggerModule,
        DesktopModule,
        RoleLayerModule,
        AuthModule,
      ],
    };
  }
}
