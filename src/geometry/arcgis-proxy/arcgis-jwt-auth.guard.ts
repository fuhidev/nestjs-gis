import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ArcgisProxyService } from '..';

@Injectable()
export class ArcgisJWTAuthGuard extends AuthGuard('jwt') {
  private arcgisProxyService: ArcgisProxyService = new ArcgisProxyService();
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req = context.switchToHttp().getRequest() as Request;
    const url = this.arcgisProxyService.getUrl(req);
    const options = this.arcgisProxyService.getHttpOptions(req);
    const isRequiredToken = await this.arcgisProxyService.isRequiredToken(
      url,
      options,
    );
    if (!isRequiredToken) {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info, context, status) {
    if (err || !user) {
      throw err || new UnauthorizedException('Không xác thực được người dùng');
    }
    return user;
  }
}
