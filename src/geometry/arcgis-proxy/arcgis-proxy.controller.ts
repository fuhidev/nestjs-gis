import { All, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ArcgisJWTAuthGuard } from './arcgis-jwt-auth.guard';
import { ArcgisProxyService } from './arcgis-proxy.service';
export class ArcgisProxyController {
  private service = new ArcgisProxyService();
  constructor() {}
  @Get('info')
  info(@Res() res, @Req() req: Request) {
    fetch(`${this.service.getArcUrl(req)}/rest/info?f=json`)
      .then(r => r.json())
      .then(r => res.send(r));
  }

  @All('services/*/MapServer/tile')
  async getTile(@Res() res: Response, @Req() req: Request) {
    this.root(res, req, 'image');
  }

  @All('services/*')
  @UseGuards(ArcgisJWTAuthGuard)
  async root(
    @Res() res: Response,
    @Req() req: Request,
    @Query('f') format = 'json',
  ) {
    const options = this.service.getHttpOptions(req);
    const route = this.service.getRoute(req.originalUrl);
    // check required token
    return this.service.send(req, options, format, res, route);
  }
}
