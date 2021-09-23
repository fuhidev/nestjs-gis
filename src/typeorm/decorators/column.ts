import { Column as TColumn,
  ColumnOptions as TColumnOptions,
  ColumnType,
  ColumnTypeUndefinedError,
  getMetadataArgsStorage,
} from 'typeorm';
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';
import { EmbeddedMetadataArgs } from 'typeorm/metadata-args/EmbeddedMetadataArgs';
import { GeneratedMetadataArgs } from 'typeorm/metadata-args/GeneratedMetadataArgs';

export interface ColumnOptions extends TColumnOptions {
    isDisplayColumn?: boolean;
  alias?: string;
  renderer?: any;
}

export function Column(
  typeOrOptions?:
    | ((type?: any) => Function)
    | ColumnType
    | (ColumnOptions & ColumnEmbeddedOptions),
  options?: ColumnOptions & ColumnEmbeddedOptions,
): PropertyDecorator {
    return TColumn(typeOrOptions as any,options)
  return function(object: Object, propertyName: string) {
    // normalize parameters
    let type: ColumnType | undefined;
    if (
      typeof typeOrOptions === 'string' ||
      typeOrOptions instanceof Function
    ) {
      type = <ColumnType>typeOrOptions;
    } else if (typeOrOptions) {
      options = <ColumnOptions>typeOrOptions;
      type = typeOrOptions.type;
    }
    if (!options) options = {} as ColumnOptions;

    // if type is not given explicitly then try to guess it
    const reflectMetadataType =
      Reflect && (Reflect as any).getMetadata
        ? (Reflect as any).getMetadata('design:type', object, propertyName)
        : undefined;
    if (!type && reflectMetadataType)
      // if type is not given explicitly then try to guess it
      type = reflectMetadataType;

    // check if there is no type in column options then set type from first function argument, or guessed one
    if (!options.type && type) options.type = type;

    // specify HSTORE type if column is HSTORE
    if (options.type === 'hstore' && !options.hstoreType)
      options.hstoreType = reflectMetadataType === Object ? 'object' : 'string';

    if (typeOrOptions instanceof Function) {
      // register an embedded
      getMetadataArgsStorage().embeddeds.push({
        target: object.constructor,
        propertyName: propertyName,
        isArray: reflectMetadataType === Array || options.array === true,
        prefix: options.prefix !== undefined ? options.prefix : undefined,
        type: typeOrOptions as (type?: any) => Function,
      } as EmbeddedMetadataArgs);
    } else {
      // register a regular column

      // if we still don't have a type then we need to give error to user that type is required
      if (!options.type)
        throw new ColumnTypeUndefinedError(object, propertyName);

      // create unique
      if (options.unique === true)
        getMetadataArgsStorage().uniques.push({
          target: object.constructor,
          columns: [propertyName],
        });

      getMetadataArgsStorage().columns.push({
        target: object.constructor,
        propertyName: propertyName,
        mode: 'regular',
        options: options,
      } as ColumnMetadataArgs);

      if (options.generated) {
        getMetadataArgsStorage().generations.push({
          target: object.constructor,
          propertyName: propertyName,
          strategy:
            typeof options.generated === 'string'
              ? options.generated
              : 'increment',
        } as GeneratedMetadataArgs);
      }
    }
  };
}
