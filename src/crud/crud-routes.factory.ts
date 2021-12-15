import { RequestMapping, RequestMethod } from '@nestjs/common';
import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { CrudResponseInterceptor, MergedCrudOptions } from '@nestjsx/crud';
import {
  ACTION_NAME_METADATA,
  CRUD_OPTIONS_METADATA,
  PARSED_CRUD_REQUEST_KEY,
} from '@nestjsx/crud/lib/constants';
import { GISCrudRequestInterceptor } from './gis-crud-request.interceptor';
import * as geojson2shp from 'geojson2shp';
import { GISCrudRequest } from 'src';
import { Response } from 'express';
export class GISCrudRoutesFactory {
  private options: MergedCrudOptions;
  constructor(private target) {}
  create() {
    this.options = Reflect.getMetadata(CRUD_OPTIONS_METADATA, this.target);
    this.registerMethod();
    this.setRouteArgs();
    this.setRouteArgsTypes();
    this.setInterceptors();
    this.setAction();
    this.setRoutePath();
  }

  private setRouteArgs() {
    let requestArg = {
      [`${PARSED_CRUD_REQUEST_KEY}${CUSTOM_ROUTE_AGRS_METADATA}:${0}`]: {
        index: 0,
        factory: (_, ctx) => {
          return (ctx.switchToHttp ? ctx.switchToHttp().getRequest() : ctx)[
            PARSED_CRUD_REQUEST_KEY
          ];
        },
        data: undefined,
        pipes: [],
      },
    };

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      { ...requestArg },
      this.target,
      'getCountBase',
    );
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      { ...requestArg },
      this.target,
      'getManyBasePost',
    );
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        ...requestArg,
        ...{
          [`${RouteParamtypes.RESPONSE}:${1}`]: {
            index: 1,
            data: undefined,
            pipes: [],
          },
          [`${RouteParamtypes.QUERY}:${2}`]: {
            index: 2,
            data: undefined,
            pipes: [],
          },
        },
      },
      this.target,
      'exportShpManyBase',
    );

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        [`${RouteParamtypes.BODY}:${0}`]: {
          index: 0,
          pipes: [],
          data: undefined,
        },
      },
      this.target,
      'executeSqlBase',
    );
  }

  private setRouteArgsTypes() {
    Reflect.defineMetadata(
      PARAMTYPES_METADATA,
      [Object],
      this.target.prototype,
      'getManyBasePost',
    );
  }

  private setInterceptors() {
    [
      'getManyBase',
      'getManyBasePost',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'createManyBase',
      'exportShpManyBase',
      'getCountBase',
    ].forEach(route => {
      Reflect.defineMetadata(
        INTERCEPTORS_METADATA,
        [GISCrudRequestInterceptor, CrudResponseInterceptor],
        this.target.prototype[route],
      );
    });
  }

  private setAction() {
    Reflect.defineMetadata(
      ACTION_NAME_METADATA,
      'Read-All-Post',
      this.target.prototype.getManyBasePost,
    );
  }

  private registerMethod() {
    this.target.prototype.getManyBasePost = function(req) {
      return this.service.getMany(req);
    };
    this.target.prototype.getCountBase = function(req) {
      return this.service.getCount(req);
    };
    this.target.prototype.exportShpManyBase = async function(
      req: GISCrudRequest,
      res: Response,
      query,
    ) {
      req.parsed.fGeo = 'geojson';
      const entities = await this.service.getMany(req);
      const geojson = entities.map(entity => {
        const properties = { ...entity };
        delete properties.shape;
        const geometry = entity.shape;
        return {
          type: 'Feature',
          properties,
          geometry,
        };
      });
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + query.filename + '.zip',
      );
      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Type', 'application/zip');
      geojson2shp.convert(geojson, res);
    };
    this.target.prototype.executeSqlBase = function(body) {
      return this.service.executeSql({ query: body.query });
    };
  }

  private setRoutePath() {
    RequestMapping({ method: RequestMethod.POST, path: '/query' })(
      this.target.prototype,
      null,
      { value: this.target.prototype.getManyBasePost },
    );
    RequestMapping({ method: RequestMethod.POST, path: '/execute' })(
      this.target.prototype,
      null,
      { value: this.target.prototype.executeSqlBase },
    );

    let getOneBasePath: string;

    const getOneBaseOld = this.target.prototype.getOneBase;

    if (this.target.prototype.getOneBase) {
      getOneBasePath = Reflect.getMetadata(
        PATH_METADATA,
        this.target.prototype.getOneBase,
      );
      delete this.target.prototype.getOneBase;
    }

    RequestMapping({ method: RequestMethod.GET, path: '/exportshp' })(
      this.target.prototype,
      null,
      { value: this.target.prototype.exportShpManyBase },
    );
    RequestMapping({ method: RequestMethod.GET, path: '/count' })(
      this.target.prototype,
      null,
      { value: this.target.prototype.getCountBase },
    );

    if (getOneBasePath) {
      this.target.prototype.getOneBase = getOneBaseOld;
      RequestMapping({ method: RequestMethod.GET, path: getOneBasePath })(
        this.target,
        null,
        {
          value: this.target.prototype.getOneBase,
        },
      );
    }
  }
}
