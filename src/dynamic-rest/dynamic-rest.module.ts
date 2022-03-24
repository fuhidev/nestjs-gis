import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateDynamicRest } from './dynamic-rest-build';
import { generateDynamicSysRest } from './dynamic-rest-sys-build';
import {
  DynamicRestFromSysOptions,
  DynamicRestOptions,
} from './dynamic-rest.interface';

@Module({})
export class DynamicRestModule {
  static async fromSys(
    options: DynamicRestFromSysOptions,
  ): Promise<DynamicModule> {
    const res = await generateDynamicSysRest(options);
    return {
      module: DynamicRestModule,
      imports: [
        TypeOrmModule.forRoot({
          ...options.dbConfig,
          entities: res.entities,
        }),
        ...res.modules,
      ],
    };
  }
  static forRoot(options: DynamicRestOptions): DynamicModule {
    const res = generateDynamicRest(options);
    return {
      module: DynamicRestModule,
      imports: [
        TypeOrmModule.forRoot({
          ...options.dbConfig,
          entities: res.entities,
        }),
        ...res.modules,
      ],
    };
  }
}
