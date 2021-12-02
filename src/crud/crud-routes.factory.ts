import { RequestMapping, RequestMethod, UseInterceptors } from '@nestjs/common';
import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  CrudOptions,
  CrudRequestInterceptor,
  CrudResponseInterceptor,
  MergedCrudOptions,
} from '@nestjsx/crud';
import {
  ACTION_NAME_METADATA,
  CRUD_OPTIONS_METADATA,
  PARSED_CRUD_REQUEST_KEY,
} from '@nestjsx/crud/lib/constants';
import { BaseEntity, getRepository } from 'typeorm';
import { GISCrudRequestInterceptor } from './gis-crud-request.interceptor';

export class GISCrudRoutesFactory {
  private options: MergedCrudOptions;
  constructor(private target) {}
  create() {
    this.options = Reflect.getMetadata(CRUD_OPTIONS_METADATA, this.target);
    this.getManyBasePost();
    this.executeSqlBase();

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
          return (ctx.switchToHttp
            ? ctx.switchToHttp().getRequest()
            : ctx)[PARSED_CRUD_REQUEST_KEY];
        },
        data: undefined,
        pipes: [],
      },
    };

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      { ...requestArg },
      this.target,
      'getManyBasePost',
    );

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        [`${RouteParamtypes.BODY}:${0}`]: {
          index:0,
          pipes:[],
          data:undefined,
        },
      },
      this.target,
      'executeSqlBase'
    )
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
    ['getManyBase', 'getManyBasePost', 'getOneBase', 'createOneBase','updateOneBase','replaceOneBase','createManyBase'].forEach(
      route => {
        Reflect.defineMetadata(
          INTERCEPTORS_METADATA,
          [GISCrudRequestInterceptor, CrudResponseInterceptor],
          this.target.prototype[route],
        );
      },
    );
  }

  private setAction() {
    Reflect.defineMetadata(
      ACTION_NAME_METADATA,
      'Read-All-Post',
      this.target.prototype.getManyBasePost,
    );
  }

  private getManyBasePost() {
    this.target.prototype.getManyBasePost = function getManyBasePost(req) {
      return this.service.getMany(req);
    };
  }

  private executeSqlBase() {
    this.target.prototype.executeSqlBase = function executeSqlBase(body) {
      return this.service.executeSql({query:body.query});
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

    const primaryParams = Object.keys(this.options.params).filter(
      key =>
        this.options.params[key].primary && !this.options.params[key].disabled,
    );

    const path = primaryParams.map(param => `/:${param}`).join('');

    RequestMapping({ method: RequestMethod.GET, path })(
      this.target.prototype,
      null,
      { value: this.target.prototype.getOneBase },
    );
  }
}
