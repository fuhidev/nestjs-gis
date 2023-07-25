import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApplicationService } from '../application/application.service';
import { LoggerActionTypeEnum } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { UserId } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logService: LoggerService,
    private applicationService: ApplicationService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    const response = await this.authService.login(req.user);
    if (response) {
      const logEntity = this.logService.repo.create();
      logEntity.actionTypeId = LoggerActionTypeEnum.LOGIN;
      logEntity.userId = response.userId;
      if (req.body.appId) {
        logEntity.applicationId = req.body.appId;
        const isAccess = await this.authService.isAccessRequest({
          idApp: req.body.appId,
          userId: response.userId,
        });
        if (!isAccess) {
          throw new UnauthorizedException('Không có quyền truy cập ứng dụng');
        }
      }

      await this.logService.repo.insert(logEntity);
    }
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('refreshtoken')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('capabilities')
  getCapabilities(@Request() req) {
    return this.authService.getCapabilities({ userId: req.user.userId });
  }
  @UseGuards(JwtAuthGuard)
  @Get('layerinfos')
  async getLayerInfos(@Request() req) {
    const response = await this.authService.getLayerInfos(req.user);
    return response;
  }
  @Get('layerinfos/anonymous')
  async getLayerInfoAnonymouses() {
    const response = await this.authService.getLayerInfosAnonymous();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('isaccess/:idApp')
  async isAccessApp(@UserId() userId: string, @Param('idApp') idApp: string) {
    return this.authService.isAccess({ idApp, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('appinfo/:id')
  @UseInterceptors(new CrudRequestInterceptor())
  async getApplicationInfo(
    @ParsedRequest() parseReq: CrudRequest,
    @Param('id') id: string,
  ) {
    parseReq.parsed.search = {
      $and: [undefined, { applicationId: id }],
    };
    const appInfo = await this.applicationService.getOne(parseReq);
    return appInfo;
  }
  @Get('appinfo/:id/anonymous')
  @UseInterceptors(new CrudRequestInterceptor())
  getApplicationInfoAno(
    @Request() @ParsedRequest() req: CrudRequest,
    @Param('id') id: string,
  ) {
    req.parsed.search = {
      $and: [undefined, { applicationId: id }],
    };

    return this.applicationService.getOne(req);
  }
}
