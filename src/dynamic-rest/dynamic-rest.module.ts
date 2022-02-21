import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateDynamicRest } from './dynamic-rest-build';
import {
  DynamicRestOptions,
} from './dynamic-rest.interface';

@Module({})
export class DynamicRestModule {
  static async forRoot(options: DynamicRestOptions): Promise<DynamicModule> {
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
