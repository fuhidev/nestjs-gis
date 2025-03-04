import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import fetch, { Headers, RequestInit } from 'node-fetch';
import { getOption } from './arcgis-proxy-token';
@Injectable()
export class ArcgisProxyService {
  private tokens: {
    [key: string]: {
      token: string;
      expires: number;
    };
  } = {};
  async getToken(route) {
    const option = getOption(route);
    let token = this.tokens[route];
    // kiem tra chua het han token thi lay token cu
    if (token && token.expires > Date.now() - 60000) {
      return token;
    }
    if (!option.user) {
      throw new BadRequestException(
        'Không xác thực được người dùng từ tài khoản liên kết',
      );
    }
    var details = {
      username: option.user.username,
      password: option.user.password,
      client: 'requestip',
      expiration: 60,
    };

    var formBody = this.formUrlEncoded(details);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    };
    const response = await (await fetch(
      `${option.arcUrl}/tokens/generateToken?f=json`,
      options,
    )).json();
    if (response.error && response.error.code === 401) {
      throw new BadRequestException(
        'Không tồn tại người dùng từ tài khoản liên kết',
      );
    }
    this.tokens[route] = response;
    return response;
  }
  formUrlEncoded(details) {
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }
  getRoute(route: string) {
    let controllerPath = route;
    controllerPath = controllerPath.substring(
      1,
      controllerPath.indexOf('/rest'),
    );
    return controllerPath;
  }
  getArcUrl(req: Request | string) {
    const route =
      typeof req === 'string' ? req : this.getRoute(req.originalUrl);
    return getOption(route).arcUrl;
  }

  getUrl(req: Request) {
    const route = this.getRoute(req.originalUrl);
    let originalUrl = req.originalUrl;
    originalUrl = this.removeURLParameter(originalUrl, 'token');
    const arcUrl = this.getArcUrl(route);
    originalUrl = originalUrl.replace(route + '/', '');
    let url = `${arcUrl}${originalUrl}`;
    return url;
  }

  getHttpOptions(req: Request) {
    const headers = new Headers();
    const options: RequestInit = {
      method: req.method,
      headers,
    };
    if (['POST', 'PATCH', 'PUT'].indexOf(req.method.toUpperCase()) > -1) {
      if (req.body.token) {
        delete req.body.token;
      }
      const contentType = req.headers['content-type'];
      if (contentType) {
        headers.append('content-type', contentType);
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          options.body = this.formUrlEncoded(req.body) as any;
        } else {
          options['body'] = req.body;
        }
      }
    }
    return options;
  }

  async isRequiredToken(url: string, options: RequestInit) {
    let idx = -1;
    {
      let link = 'MapServer';
      if ((idx = url.lastIndexOf(link)) === -1) {
        link = 'FeatureServer';
        idx = url.lastIndexOf(link);
      }
      if (idx > -1) {
        idx = idx + link.length;
      }
    }
    if (idx > -1) {
      const baseurl = url.substring(0, idx) + '?f=json';
      const resOp = await fetch(baseurl, options);
      const json = await resOp.json();
      if (json.error && json.error.code === 499) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  async printExecute(
    req: Request,
    options: RequestInit,
    res: Response,
    route: string,
  ) {
    try {
      let url = this.getUrl(req);
      const isRequiredToken = await this.isRequiredToken(url, options);
      if (isRequiredToken) {
        const token = await this.getToken(route);
        url += `${url.indexOf('?') > -1 ? '&' : '?'}token=${token.token}`;
      }
      const resOp = await fetch(url, options);
        const json = await resOp.json();
        if(json.results?.length){
          json.results.forEach((item)=>{
            if(item.value?.url){
              item.value.url = item.value.url.replace( this.getArcUrl(req),getOption(route).host+'/'+route);
            }
          })
        }
        res.send(json);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async send(
    req: Request,
    options: RequestInit,
    format: string,
    res: Response,
    route: string,
  ) {
    try {
      let url = this.getUrl(req);
      const isRequiredToken = await this.isRequiredToken(url, options);
      if (isRequiredToken) {
        const token = await this.getToken(route);
        url += `${url.indexOf('?') > -1 ? '&' : '?'}token=${token.token}`;
      }
      const resOp = await fetch(url, options);
      if (format === 'json') {
        const json = await resOp.json();
        res.send(json);
      } else if (format === 'image') {
        const buffer = await resOp.buffer();
        res.contentType('image/png');
        res.send(buffer);
      }else if(format === 'pdf'){
        const buffer = await resOp.buffer();
        res.contentType('application/pdf');
        res.send(buffer);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(parameter) + '=';
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
  }
}
