import { Controller, Post, Body, Get, UseInterceptors, Request, UseGuards, Param, UsePipes, ValidationPipe, Patch, Req, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CrudRequestInterceptor, ParsedRequest, Crud } from '@nestjsx/crud';
import { UserStatusService } from './user-status/user-status.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BodyChangePwd } from './user.interface';

@UseGuards(JwtAuthGuard)
@Crud({
  model: { type: UserEntity },
  query: {
    join: {
      status: {},
      role: {}
    },
    exclude:['password']
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
  params: {
    id: {
      primary: true,
      field: 'userId',
      type: 'uuid'
    }
  }
})
@Controller('sys/user')
export class UserController {
  constructor(
    private service: UserService,
    private statusService: UserStatusService
  ) {

  }

  @Get()
  @UseInterceptors(new CrudRequestInterceptor())
  getMany(@Request() @ParsedRequest() req) {
    return this.service.getMany(req);
  }

  @Post()
  create(@Body() user: UserEntity) {
    return this.service.create(user);
  }

  @Patch('cpwd')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req, @Body() body: BodyChangePwd) {
    return this.service.changePassword({
      userSessionId: req.user.userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword
    });
  }
  @Patch('cpwd-admin')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  changePasswordAdmin(
    @Req() req, @Body() body: BodyChangePwd) {
    return this.service.changePasswordAdmin({
      userSessionId: req.user.userId,
      userId: body.userId,
      newPassword: body.newPassword
    });
  }

  @Get('status')
  @UseInterceptors(new CrudRequestInterceptor())
  getStatusMany(@Request() @ParsedRequest() req) {
    return this.statusService.getMany(req);
  }
}