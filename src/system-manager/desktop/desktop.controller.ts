import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { UserId } from '../auth';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { LoggerActionTypeService } from '../logger/logger.action-type.service';
import { LoggerEntity } from '../logger/logger.entity';
import { LoggerService } from '../logger/logger.service';
import { DesktopService } from './desktop.service';

@Controller('desktop')
export class DesktopController {
  constructor(
    private desktopService: DesktopService,
    private authService: AuthService,
    private logService: LoggerService,
    private logActionTypeService: LoggerActionTypeService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // return req.user;
    // // const { username, password } = req.body;
    return {
      token: (await this.authService.login(req.user)).accessToken,
      username: req.user.username,
      displayname: req.user.displayName,
      userId: req.user.userId,
    };
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // @ApiBody({ type: LoginRequestBody })
  // async loginWithUser(@Request() req) {
  //     const { username, password } = req.body;
  //     // const token = (await this.authService.login({ username, password })).accessToken;
  //     // const appId = req.body.appId;
  //     // if (appId) {
  //     //     this.authService.isAccess({idApp:})
  //     // }
  //     return {
  //         token,
  //         username,

  //     }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('IsAccess/:idApp')
  async isAccessApp(@UserId() userId: string, @Param('idApp') idApp: string) {
    return this.desktopService.isAccess({ userId, appId: idApp });
  }

  @UseGuards(JwtAuthGuard)
  @Get('LayerInfo')
  async getAccountProfile(@Request() req) {
    return this.desktopService.getLayerInfos({ username: req.user.username });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logger')
  addLog(@Request() req, @Body() log: LoggerEntity) {
    log.userId = req.user.userId;
    return this.logService.repo.insert(log);
  }

  @Get('logger/action-type')
  @UseInterceptors(new CrudRequestInterceptor())
  getManyActionType(@Request() @ParsedRequest() req) {
    return this.logActionTypeService.getMany(req);
  }
}
