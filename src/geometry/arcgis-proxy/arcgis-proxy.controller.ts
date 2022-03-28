import { All, BadRequestException, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import fetch, { RequestInit, Headers } from 'node-fetch';
import { JwtAuthGuard } from '../../system-manager/auth/jwt-auth.guard';
import { getOption } from './arcgis-proxy-token';
export class ArcgisProxyController {
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
  @Get('info')
  info(@Res() res, @Req() req: Request) {
    debugger;
    fetch(`${this.getArcUrl(req)}/rest/info?f=json`)
      .then(r => r.json())
      .then(r => res.send(r));
  }
  @All('services/*')
  @UseGuards(JwtAuthGuard)
  async root(
    @Res() res: Response,
    @Req() req: Request,
    @Query('f') format = 'json',
  ) {
    const headers = new Headers();
    // Object.keys(req.headers).forEach(key => {
    //   const value = req.headers[key] as string;
    //   if (value) {
    //     headers.append(key, value);
    //   }
    // });
    const route = this.getRoute(req.originalUrl);
    const arcUrl = this.getArcUrl(route);
    const options: RequestInit = {
      method: req.method,
      headers,
    };
    if (['POST', 'PATCH', 'PUT'].indexOf(req.method.toUpperCase()) > -1) {
      if (req.body.token) {
        delete req.body.token;
      }
      const contentType = req.headers['content-type'];
      headers.append('content-type', contentType);
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        options.body = this.formUrlEncoded(req.body) as any;
      } else {
        options['body'] = req.body;
      }
    }
    req.originalUrl = this.removeURLParameter(req.originalUrl, 'token');

    req.originalUrl = req.originalUrl.replace(route, '');
    let url = `${arcUrl}${req.originalUrl}`;

    if (url.indexOf('/MapServer/tile') > -1) {
      format = 'image';
    }
    this.send(url, options, format, res, route);
  }

  private async send(
    url: string,
    options: RequestInit,
    format: string,
    res: Response,
    route: string,
  ) {
    try {
      const resOp = await fetch(url, options);
      if (format === 'json') {
        const json = await resOp.json();
        if (json.error && json.error.code === 499) {
          const token = await this.getToken(route);
          url += `${url.indexOf('?') > -1 ? '&' : '?'}token=${token.token}`;
          this.send(url, options, format, res, route);
        } else {
          res.send(json);
        }
      } else if (format === 'image') {
        const buffer = await resOp.buffer();
        res.contentType('image/png');
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
