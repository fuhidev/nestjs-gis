import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { EntityManager, getRepository } from 'typeorm';
import { LayerService } from '../layer';
import { systemManagerOption } from '../system-manager.token';
import { UserStatusEnum } from '../user/user.constant';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectEntityManager() private entityManager: EntityManager,
    private layerService: LayerService,
  ) {}
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {}
    return false;
  }
  async validateUser(username: string, password: string): Promise<UserEntity> {
    let result = {
      username,
      displayName: '',
      userId: '',
      roleId: '',
    } as UserEntity;
    const user = await this.userService.findOne(
      { username },
      {
        select: ['password', 'displayName', 'userId', 'statusId', 'roleId'],
        relations: ['role'],
      },
    );

    if (user && compareSync(password, user.password)) {
      if (user.statusId === UserStatusEnum.Locked) {
        throw new UnauthorizedException('Tài khoản đã bị khóa');
      } else if (user.statusId === UserStatusEnum.Request) {
        throw new UnauthorizedException('Tài khoản đang chờ duyệt');
      } else if (user.statusId === UserStatusEnum.Expired) {
        throw new UnauthorizedException('Tài khoản đã hết hạn');
      }
      result.displayName = user.displayName;
      result.userId = user.userId;
      result.roleId = user.roleId;
      return result;
    }
    return null;
  }

  async login(user: Partial<UserEntity>) {
    const payload = {
      username: user.username,
      userId: user.userId,
      displayName: user.displayName,
    };
    return {
      userId: user.userId,
      username: user.username,
      displayName: user.displayName,
      accessToken: this.jwtService.sign(payload),
      roleId: user.roleId,
      expired: Math.round(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000,
      ),
    };
  }

  async refreshToken(userId: string) {
    const payload = await this.userService.findOne(userId, {
      select: ['username', 'displayName'],
    });
    return {
      accessToken: this.jwtService.sign(
        { userId: payload.userId },
        {
          expiresIn: '15m',
        },
      ),
      expired: Math.round(
        new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000,
      ),
    };
  }

  /**
   * Kiểm tra quyền truy cập của tài khoản
   */
  async isAccess(params: { idApp: string; username: string }) {
    const { idApp, username } = params;
    const user = await this.userService.findOne(
      {
        username,
      },
      {
        relations: ['role', 'role.applications'],
      },
    );
    return user.role.applications.some(
      f => f.applicationId === idApp && f.isEnabled,
    );
  }

  async getCapabilities(params: { userId: string }): Promise<string[]> {
    const capabilities: Array<any> = await this.entityManager.query(
      `select applicationId=c.applicationId from sys_user a inner join sys_role b on a.roleId=b.roleId inner join sys_role_application c on b.roleId=c.roleId where userId=@0`,
      [params.userId],
    );
    return capabilities.map(m => m.applicationId);
  }

  async getLayerInfos(params: { username: string }) {
    const { username } = params;
    const result = await getRepository(UserEntity)
      .createQueryBuilder('usr')
      .innerJoin('usr.role', 'rl')
      .innerJoin('rl.layers', 'lyrs')
      .innerJoin('lyrs.layer', 'lr')
      .innerJoin('lr.dataset', 'dts')
      .where('usr.username=:usn', { usn: username })
      .select([
        'layerId = lr.layerId',
        'layerName = lr.layerName',
        'isView=lyrs.isView',
        'isCreate=lyrs.isCreate',
        'isDelete=lyrs.isDelete',
        'isEdit=lyrs.isEdit',
        'stt = lr.stt',
        'isApi = lr.isAPI',
        'definition=lyrs.definition',
        'url=lr.url',
        'outFields = lyrs.outFields',
        'queryFields = lyrs.queryFields',
        'updateFields = lyrs.updateFields',
        'datasetId=dts.datasetId',
        'datasetName=dts.datasetName',
        'datasetStt = dts.stt',
      ])
      .orderBy('dts.stt', 'ASC')
      .addOrderBy('lr.stt', 'ASC')
      .getRawMany();
    result.forEach(r => {
      if (r.isApi || (!r.isApi && !r.url.startsWith('http'))) {
        r.url = systemManagerOption.host + '/' + r.url;
      }
      r.dataset = {
        datasetId: r.datasetId,
        datasetName: r.datasetName,
        stt: r.datasetStt,
      };
      r.isVisible = true;
      delete r.datasetId;
      delete r.datasetName;
      delete r.datasetStt;
      delete r.isApi;
    });
    return result;
  }
  async getLayerInfosAnonymous() {
    const response = await this.layerService.find({ relations: ['dataset'] });
    response.forEach(layerEntity => {
      if (
        layerEntity.isApi ||
        (!layerEntity.isApi && !layerEntity.url.startsWith('http'))
      ) {
        layerEntity.url = systemManagerOption.host + '/' + layerEntity.url;
      }
    });
    return response;
  }
}
